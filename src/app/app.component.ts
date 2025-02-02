import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkerClient, WorkerManager } from '@wbds/angular-web-worker';
import { AppWorker } from './app.worker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly valueFromClient1 = signal('');
  protected readonly valueFromClient2 = signal('');

  private readonly client1: WorkerClient<AppWorker>;
  private readonly client2: WorkerClient<AppWorker>;

  constructor(private workerManager: WorkerManager) {
    if (this.workerManager.isBrowserCompatible) {
      this.client1 = this.workerManager.createClient(AppWorker);
      this.client2 = this.workerManager.createClient(AppWorker);
    } else {
      this.client1 = this.workerManager.createClient(AppWorker, true);
      this.client2 = this.workerManager.createClient(AppWorker, true);
    }
  }

  protected async createWorkers(): Promise<void> {
    await Promise.all([this.client1.connect(), this.client2.connect()]);

    const returnValue = await this.client1.call(w => w.doSomeWork('Client 1', 2000));
    this.valueFromClient1.set(returnValue);
    const returnValue2 = await this.client2.call(w => w.doSomeWork('Client 2', 2000));
    this.valueFromClient2.set(returnValue2);
  }
}
