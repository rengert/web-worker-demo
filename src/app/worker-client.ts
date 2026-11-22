import { DestroyRef, inject } from '@angular/core';
import { WorkerClient, WorkerManager } from '@wbds/angular-web-worker';
import { AppWorker } from './app-worker';

/**
 * Creates a client for `AppWorker` in an injection context.
 * Falls back to running in the app when the browser has no Worker support
 * and terminates the worker when the component is destroyed.
 */
export function injectAppWorker(runInApp = false): WorkerClient<AppWorker> {
  const manager = inject(WorkerManager);
  const client = manager.createClient(AppWorker, runInApp || !manager.isBrowserCompatible);
  inject(DestroyRef).onDestroy(() => client.destroy());
  return client;
}
