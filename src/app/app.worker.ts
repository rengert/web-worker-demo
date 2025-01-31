import {AngularWebWorker, bootstrapWorker, Callable, OnWorkerInit} from '@wbds/angular-web-worker/web-worker';
/// <reference lib="webworker" />

@AngularWebWorker()
export class AppWorker implements OnWorkerInit {

  constructor() {}

  onWorkerInit() {
  }

  @Callable()
  async doSomeWork(value1: string, value2: number): Promise<string> {
    return `${value1}-${value2 * 2}`;
  }

}
bootstrapWorker(AppWorker);
