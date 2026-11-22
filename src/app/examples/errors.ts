import { Component, signal } from '@angular/core';
import { injectAppWorker } from '../worker-client';

@Component({
  template: `
    <h2>Error handling</h2>
    <p>
      An error thrown in a <code>&#64;Callable()</code> method rejects the promise returned by
      <code>client.call()</code>.
    </p>
    <button (click)="run()">Throw in worker</button>
    <p>{{ result() }}</p>
  `,
})
export default class Errors {
  protected readonly result = signal('');
  private readonly client = injectAppWorker();

  protected async run(): Promise<void> {
    await this.client.connect();
    try {
      await this.client.call(w => w.fail('Something went wrong in the worker'));
    } catch (error) {
      this.result.set(`Caught: ${(error as Error).message ?? JSON.stringify(error)}`);
    }
  }
}
