import { Component, signal } from '@angular/core';
import { injectAppWorker } from '../worker-client';

@Component({
  template: `
    <h2>Worker state</h2>
    <p>
      A property decorated with <code>&#64;Accessable()</code> can be read with <code>client.get()</code> and written
      with <code>client.set()</code>. The value lives in the worker; the app only holds a copy.
    </p>
    <button (click)="increment()">Increment in worker</button>
    <button (click)="reset()">Set to 0</button>
    <button (click)="read()">Read</button>
    <p>Counter in the worker: {{ counter() ?? 'not read yet' }}</p>
  `,
})
export default class State {
  protected readonly counter = signal<number | undefined>(undefined);
  private readonly client = injectAppWorker();

  protected async increment(): Promise<void> {
    await this.client.connect();
    this.counter.set(await this.client.call(w => w.increment()));
  }

  protected async reset(): Promise<void> {
    await this.client.connect();
    await this.client.set(w => w.counter, 0);
    await this.read();
  }

  protected async read(): Promise<void> {
    await this.client.connect();
    this.counter.set(await this.client.get(w => w.counter));
  }
}
