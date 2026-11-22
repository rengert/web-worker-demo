/// <reference lib="webworker" />
import { bootstrapWorker } from '@wbds/angular-web-worker/web-worker';
import { AppWorker } from './app-worker';

// Entry point of the worker bundle, loaded via `new Worker(new URL('./app.worker.ts', import.meta.url))`.
bootstrapWorker(AppWorker);
