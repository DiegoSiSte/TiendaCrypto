import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="page section container" style="min-height:55vh; display:grid; place-items:center; text-align:center">
      <div>
        <span class="eyebrow">Error 404</span>
        <h1 style="margin:1rem 0">Esta ruta se fue al moon.</h1>
        <p>La página que buscas no existe. Vuelve al inicio y sigue explorando.</p>
        <a routerLink="/" class="btn btn-primary" style="margin-top:1.5rem">Volver al inicio</a>
      </div>
    </div>
  `
})
export class NotFoundPage {}
