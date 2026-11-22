import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { WorkerModule } from '@wbds/angular-web-worker';
import { AppWorker } from './app-worker';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // Hash routing keeps deep links working on GitHub Pages.
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(
      WorkerModule.forWorkers([
        {
          worker: AppWorker,
          initFn: () => new Worker(new URL('./app.worker.ts', import.meta.url), { type: 'module' }),
        },
      ])
    ),
  ],
};
