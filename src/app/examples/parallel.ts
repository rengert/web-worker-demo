import { Component, signal } from '@angular/core';
import { injectAppWorker } from '../worker-client';

const LIMIT = 2_000_000;

@Component({
  template: `
    <h2>Parallel workers</h2>
    <p>
      Each client owns one worker. The same job (primes below {{ limit.toLocaleString() }}) runs four times, once in a
      single worker one after another, once in four workers at the same time with <code>Promise.all</code>.
    </p>
    <button (click)="runSequential()" [disabled]="busy()">1 worker, 4 jobs in a row</button>
    <button (click)="runParallel()" [disabled]="busy()">4 workers in parallel</button>
    <p>{{ result() }}</p>
  `,
})
export default class Parallel {
  protected readonly limit = LIMIT;
  protected readonly result = signal('');
  protected readonly busy = signal(false);
  private readonly clients = [injectAppWorker(), injectAppWorker(), injectAppWorker(), injectAppWorker()];

  protected runSequential(): Promise<void> {
    return this.measure('in a row', async () => {
      const [client] = this.clients;
      await client.connect();
      for (let i = 0; i < 4; i++) await client.call(w => w.countPrimes(LIMIT));
    });
  }

  protected runParallel(): Promise<void> {
    return this.measure('in parallel', async () => {
      await Promise.all(this.clients.map(c => c.connect()));
      await Promise.all(this.clients.map(c => c.call(w => w.countPrimes(LIMIT))));
    });
  }

  private async measure(label: string, work: () => Promise<void>): Promise<void> {
    this.busy.set(true);
    this.result.set('Running…');
    const start = performance.now();
    await work();
    this.result.set(`4 jobs ${label}: ${Math.round(performance.now() - start)} ms.`);
    this.busy.set(false);
  }
}
