import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WorkerClient, WorkerManager} from '@wbds/angular-web-worker';
import {AppWorker} from './app.worker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'web-worker-demo';

  private client1?: WorkerClient<AppWorker>;
  private client2?: WorkerClient<AppWorker>;

  constructor(private workerManager: WorkerManager) {}

  ngOnInit() {
    if(this.workerManager.isBrowserCompatible) {
      this.client1 = this.workerManager.createClient(AppWorker);
      this.client2 = this.workerManager.createClient(AppWorker);
    } else {
      this.client1 = this.workerManager.createClient(AppWorker, true);
      this.client2 = this.workerManager.createClient(AppWorker, true);
    }
  }

  protected async createWorkers(): Promise<void> {
    if(!this.client1 || !this.client2) {
      return;
    }
    await Promise.all([this.client1.connect(), this.client2.connect()]);

    const returnValue = await this.client1.call(w => w.doSomeWork('value', 2000));
    console.log(returnValue);
    const returnValue2 = await this.client2.call(w => w.doSomeWork('value', 2000));
    console.log(returnValue2);

  }
}
