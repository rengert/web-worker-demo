import { Routes } from '@angular/router';

export const examples = [
  { path: 'heavy-work', title: 'Heavy work', load: () => import('./examples/heavy-work') },
  { path: 'parallel', title: 'Parallel workers', load: () => import('./examples/parallel') },
  { path: 'progress', title: 'Progress events', load: () => import('./examples/progress') },
  { path: 'state', title: 'Worker state', load: () => import('./examples/state') },
  { path: 'errors', title: 'Error handling', load: () => import('./examples/errors') },
  { path: 'fallback', title: 'In-app fallback', load: () => import('./examples/fallback') },
];

export const routes: Routes = [
  ...examples.map(e => ({ path: e.path, title: e.title, loadComponent: () => e.load().then(m => m.default) })),
  { path: '**', redirectTo: 'heavy-work' },
];
