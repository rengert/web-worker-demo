import { Accessable, AngularWebWorker, Callable, OnWorkerInit, Subscribable } from '@wbds/angular-web-worker/web-worker';
import { Subject } from 'rxjs';
import { countPrimes } from './primes';

/**
 * The worker class. It is kept separate from `app.worker.ts` so the app can import it
 * (needed for `createClient()` and the in-app fallback) without running `bootstrapWorker()`.
 */
@AngularWebWorker()
export class AppWorker implements OnWorkerInit {
  /** Readable and writable from the app via `client.get()` / `client.set()`. */
  @Accessable() counter!: number;

  /** Observable from the app via `client.observe()` / `client.subscribe()`. */
  @Subscribable() progress!: Subject<number>;

  // Initialise state here, not in the constructor or field initialisers:
  // the class is also instantiated on the client side.
  onWorkerInit(): void {
    this.counter = 0;
    this.progress = new Subject<number>();
  }

  @Callable()
  countPrimes(limit: number): number {
    return countPrimes(limit);
  }

  @Callable()
  countPrimesWithProgress(limit: number): number {
    return countPrimes(limit, percent => this.progress.next(percent));
  }

  @Callable()
  increment(): number {
    return ++this.counter;
  }

  @Callable()
  fail(message: string): never {
    throw new Error(message);
  }
}
