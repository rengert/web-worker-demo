import { AngularWebWorker, bootstrapWorker, Callable, OnWorkerInit } from '@wbds/angular-web-worker/web-worker';

/// <reference lib="webworker" />

@AngularWebWorker()
export class AppWorker implements OnWorkerInit {
  constructor() {
    console.log('AppWorker created');
  }

  onWorkerInit() {
    console.log('AppWorker initialized');
  }

  @Callable()
  async doSomeWork(value1: string, value2: number): Promise<string> {
    const random = Math.random();
    return `${value1}-${value2 * 2 * random}`;
  }
}

bootstrapWorker(AppWorker);
