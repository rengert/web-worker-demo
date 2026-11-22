import { Component, signal } from '@angular/core';
import { injectAppWorker } from '../worker-client';

const LIMIT = 5_000_000;

@Component({
  template: `
    <h2>Progress events</h2>
    <p>
      The worker exposes an RxJS <code>Subject</code> decorated with <code>&#64;Subscribable()</code>. The app observes
      it with <code>client.observe()</code> and writes each value into a signal.
    </p>
    <button (click)="run()" [disabled]="busy()">Start</button>
    <progress max="100" [value]="progress()"></progress>
    <p>{{ result() }}</p>
  `,
})
export default class Progress {
  protected readonly progress = signal(0);
  protected readonly result = signal('');
  protected readonly busy = signal(false);
  private readonly client = injectAppWorker();

  protected async run(): Promise<void> {
    this.busy.set(true);
    await this.client.connect();
    const progress$ = await this.client.observe(w => w.progress);
    const subscription = progress$.subscribe(percent => this.progress.set(percent));
    const primes = await this.client.call(w => w.countPrimesWithProgress(LIMIT));
    subscription.unsubscribe();
    // Also releases the subscription inside the worker.
    await this.client.unsubscribe(progress$);
    this.result.set(`${primes} primes below ${LIMIT.toLocaleString()}.`);
    this.busy.set(false);
  }
}
