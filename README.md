# Angular Web Worker demo

Runnable examples for [`@wbds/angular-web-worker`](https://www.npmjs.com/package/@wbds/angular-web-worker), a library that lets an Angular app talk to a Web Worker like a normal TypeScript class.

**Live demo:** https://rengert.github.io/web-worker-demo/

Built with Angular 22 (zoneless, standalone, signals) and `@wbds/angular-web-worker` 22.

## Examples

Each example is one route and one file in [`src/app/examples`](src/app/examples). All of them use the same worker, [`src/app/app-worker.ts`](src/app/app-worker.ts).

| Example                                          | Shows                                                     | Library feature                           |
| ------------------------------------------------ | --------------------------------------------------------- | ----------------------------------------- |
| [Heavy work](src/app/examples/heavy-work.ts)     | The same CPU-heavy job on the main thread and in a worker | `@Callable()`, `client.call()`            |
| [Parallel workers](src/app/examples/parallel.ts) | Four workers at once vs. four jobs in one worker          | one `WorkerClient` per worker             |
| [Progress events](src/app/examples/progress.ts)  | A progress bar fed by the worker                          | `@Subscribable()`, `client.observe()`     |
| [Worker state](src/app/examples/state.ts)        | Reading and writing a value that lives in the worker      | `@Accessable()`, `client.get()` / `set()` |
| [Error handling](src/app/examples/errors.ts)     | An exception in the worker rejects the call in the app    | error serialization                       |
| [In-app fallback](src/app/examples/fallback.ts)  | The same worker class running without a worker            | `createClient(AppWorker, true)`           |

## Run it locally

Requires Node.js 22.22.3 or later (see [`.nvmrc`](.nvmrc)).

```bash
npm ci
npm start        # http://localhost:4200
npm test -- --watch=false
npm run lint
```

## Using the library in your own app

### 1. Install

```bash
npm i @wbds/angular-web-worker reflect-metadata
```

Use the library version with the same major as your Angular version.

### 2. Add a TypeScript config for workers

Create `tsconfig.worker.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/worker",
    "lib": ["es2022", "webworker"],
    "types": []
  },
  "include": ["src/**/*.worker.ts"]
}
```

and reference it in `angular.json` under `projects.<name>.architect.build.options`:

```json
"webWorkerTsConfig": "tsconfig.worker.json"
```

### 3. Write the worker

Keep the class and the worker entry point in separate files. The app imports the class; only the entry point calls `bootstrapWorker()`.

```typescript
// app-worker.ts
import { AngularWebWorker, Callable, OnWorkerInit } from '@wbds/angular-web-worker/web-worker';

@AngularWebWorker()
export class AppWorker implements OnWorkerInit {
  onWorkerInit(): void {
    // initialise state here, not in the constructor
  }

  @Callable()
  doSomeWork(value: string): string {
    return value.toUpperCase();
  }
}
```

```typescript
// app.worker.ts
/// <reference lib="webworker" />
import { bootstrapWorker } from '@wbds/angular-web-worker/web-worker';
import { AppWorker } from './app-worker';

bootstrapWorker(AppWorker);
```

Worker code must not import from `@angular/core`, directly or indirectly.

### 4. Register the worker

```typescript
// app.config.ts
importProvidersFrom(
  WorkerModule.forWorkers([
    {
      worker: AppWorker,
      initFn: () => new Worker(new URL('./app.worker.ts', import.meta.url), { type: 'module' }),
    },
  ])
);
```

The `new URL('./app.worker.ts', import.meta.url)` form is required so the Angular build creates a separate worker bundle.

### 5. Call it

[`src/app/worker-client.ts`](src/app/worker-client.ts) wraps client creation: it falls back to in-app mode when the browser has no Worker support and destroys the worker with the component.

```typescript
export class MyComponent {
  private readonly client = injectAppWorker();

  async run() {
    await this.client.connect();
    const result = await this.client.call(w => w.doSomeWork('hello'));
  }
}
```

For the full API see the [library README](https://github.com/weisenburger-bau-GmbH/angular-web-worker#readme).

## Testing

[`src/app/app-worker.spec.ts`](src/app/app-worker.spec.ts) tests the worker class through an in-app `WorkerClient`, so no real worker is needed. Tests run with Vitest via `ng test`.
