# WebWorkerDemo

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.
and demonstrates how to use Web Workers in an Angular application.
To simplify the usage the package [Angular Web Worker](https://www.npmjs.com/package/@wbds/angular-web-worker) is used

## Development server

To start a local development server, run:

```bash
  ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will
automatically reload whenever you modify any of the source files.

## Simple setup

### Install the package

```bash
  npm i @wbds/angular-web-worker --save
```

At least the RC version should be used, because the stable version does not support Angular 19.

### Config file

Create a type script config file and reference is it in the `angular.json` file.

```
"webWorkerTsConfig": "tsconfig.worker.json",
```

In my case it is simple

```json
{
  "extends": "tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/worker",
    "lib": [
      "es2018",
      "webworker"
    ],
    "types": []
  },
  "include": [
    "src/**/*.worker.ts"
  ]
}
```

### Create a worker

Create a worker file in the `src` folder. In my case it is `src/app/app-worker.worker.ts`

### Register the module

```typescript
 importProvidersFrom(
    WorkerModule.forWorkers([
        {
            worker: AppWorker,
            initFn: () => new Worker(new URL('./app.worker.ts', import.meta.url), {type: 'module'}),
        },
    ])
)  
```

