import { Component, DestroyRef, inject, signal } from '@angular/core';
import { countPrimes } from '../primes';
import { injectAppWorker } from '../worker-client';

const LIMIT = 3_000_000;

@Component({
  template: `
    <h2>Heavy work: main thread vs. worker</h2>
    <p>
      Counts the primes below {{ limit.toLocaleString() }}. The clock below is updated on every animation frame. It
      freezes while the main thread is busy and keeps running while the worker does the work.
    </p>
    <p>
      Clock: <strong>{{ clock() }}</strong>
    </p>
    <button (click)="runOnMainThread()" [disabled]="busy()">Run on main thread</button>
    <button (click)="runInWorker()" [disabled]="busy()">Run in worker</button>
    <p>{{ result() }}</p>
  `,
})
export default class HeavyWork {
  protected readonly limit = LIMIT;
  protected readonly clock = signal('');
  protected readonly result = signal('');
  protected readonly busy = signal(false);
  private readonly client = injectAppWorker();

  constructor() {
    const tick = () => {
      this.clock.set(new Date().toISOString().slice(11, 23));
      frame = requestAnimationFrame(tick);
    };
    let frame = requestAnimationFrame(tick);
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(frame));
  }

  protected runOnMainThread(): void {
    this.measure('main thread', async () => countPrimes(LIMIT));
  }

  protected runInWorker(): void {
    this.measure('worker', async () => {
      await this.client.connect();
      return this.client.call(w => w.countPrimes(LIMIT));
    });
  }

  private async measure(where: string, work: () => Promise<number>): Promise<void> {
    this.busy.set(true);
    this.result.set(`Running on ${where}…`);
    // Let the "Running…" text render before the main thread may block.
    await new Promise(resolve => setTimeout(resolve));
    const start = performance.now();
    const primes = await work();
    this.result.set(`${primes} primes, ${Math.round(performance.now() - start)} ms on ${where}.`);
    this.busy.set(false);
  }
}
