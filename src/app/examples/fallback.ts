import { Component, signal } from '@angular/core';
import { injectAppWorker } from '../worker-client';

@Component({
  template: `
    <h2>In-app fallback</h2>
    <p>
      <code>createClient(AppWorker, true)</code> runs the same worker class inside the app. This is the fallback for
      browsers without Worker support. The API stays the same, but heavy work blocks the UI again.
    </p>
    <button (click)="run()">Call worker running in the app</button>
    <p>{{ result() }}</p>
  `,
})
export default class Fallback {
  protected readonly result = signal('');
  private readonly client = injectAppWorker(true);

  protected async run(): Promise<void> {
    await this.client.connect();
    const primes = await this.client.call(w => w.countPrimes(100_000));
    this.result.set(`${primes} primes below 100,000, computed without a worker.`);
  }
}
