import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { examples } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <h1>Angular Web Worker demo</h1>
      <p>
        Examples for
        <a href="https://www.npmjs.com/package/@wbds/angular-web-worker">&#64;wbds/angular-web-worker</a>.
      </p>
      <nav>
        @for (example of examples; track example.path) {
          <a [routerLink]="example.path" routerLinkActive="active">{{ example.title }}</a>
        }
      </nav>
    </header>
    <main><router-outlet /></main>
  `,
})
export class App {
  protected readonly examples = examples;
}
