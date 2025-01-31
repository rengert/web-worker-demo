import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {WorkerModule} from '@wbds/angular-web-worker';
import {AppWorker} from './app.worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      WorkerModule.forWorkers([
        {worker: AppWorker, initFn: () => new Worker(new URL('./app.worker.ts', import.meta.url), { type: 'module' })},
      ])
    ),
  ]
};
