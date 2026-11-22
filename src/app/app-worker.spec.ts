import { WorkerClient } from '@wbds/angular-web-worker';
import { AppWorker } from './app-worker';

describe('AppWorker', () => {
  let client: WorkerClient<AppWorker>;

  beforeEach(async () => {
    // Runs the worker class in the test process (in-app mode), so no real Worker is needed.
    client = new WorkerClient<AppWorker>({ worker: AppWorker, initFn: () => undefined as unknown as Worker }, true);
    await client.connect();
  });

  afterEach(() => client.destroy());

  it('counts primes via call()', async () => {
    expect(await client.call(w => w.countPrimes(100))).toBe(25);
  });

  it('exposes the counter via get() and set()', async () => {
    expect(await client.call(w => w.increment())).toBe(1);
    expect(await client.get(w => w.counter)).toBe(1);
    await client.set(w => w.counter, 10);
    expect(await client.call(w => w.increment())).toBe(11);
  });

  it('emits progress via observe()', async () => {
    const values: number[] = [];
    const progress$ = await client.observe(w => w.progress);
    const subscription = progress$.subscribe(v => values.push(v));
    await client.call(w => w.countPrimesWithProgress(1000));
    subscription.unsubscribe();
    expect(values.at(-1)).toBe(100);
  });

  it('rejects call() when the worker method throws', async () => {
    await expect(client.call(w => w.fail('boom'))).rejects.toBeTruthy();
  });
});
