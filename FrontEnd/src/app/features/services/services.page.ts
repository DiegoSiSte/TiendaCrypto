import { Component, OnInit, inject, signal } from '@angular/core';
import { CatalogService } from '../../core/catalog.service';
import { ChatService } from '../../core/chat.service';
import { DEMO_SERVICES } from '../../core/fallback-data';
import { Service } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';
import { TiltDirective } from '../../shared/tilt.directive';

@Component({
  selector: 'app-services',
  imports: [RevealDirective, TiltDirective],
  template: `
    <div class="page section container">
      <div class="section-head" appReveal>
        <div>
          <span class="eyebrow">Servicios cripto</span>
          <h1 style="font-size:clamp(2rem,4.5vw,3.4rem)">Del primer HODL al audit.</h1>
        </div>
        <p>Ocho servicios con alcance y precio claros. Elige el punto de partida y hablamos.</p>
      </div>

      <div class="services-grid" appReveal>
        @for (service of services(); track service.id) {
          <article class="glass service-card card-3d" appTilt [class.featured]="service.featured">
            <span class="service-icon">{{ service.icon }}</span>
            <h3>{{ service.name }}</h3>
            <p>{{ service.description }}</p>
            <div class="service-meta">
              <span class="service-price">desde {{ service.priceFrom }} USD</span>
              <button class="link-action" type="button" (click)="ask(service.name)">Consultar</button>
            </div>
          </article>
        }
      </div>

      <div class="glass panel" style="margin-top:2rem" appReveal>
        <h2>¿No sabes cuál elegir?</h2>
        <p style="margin:0.7rem 0 1.2rem">Cuéntale al asistente qué quieres lograr y te orienta con datos reales de la plataforma.</p>
        <button class="btn btn-primary" type="button" (click)="ask('¿qué servicio me recomiendas?')">Preguntar al asistente</button>
      </div>
    </div>
  `
})
export class ServicesPage implements OnInit {
  private readonly catalog = inject(CatalogService);
  private readonly chat = inject(ChatService);
  readonly services = signal<Service[]>(DEMO_SERVICES);

  ngOnInit(): void {
    this.catalog.services().subscribe({
      next: (response) => {
        if (response.services?.length) this.services.set(response.services);
      },
      error: () => undefined
    });
  }

  ask(service: string): void {
    this.chat.request(`Quiero información sobre ${service}`);
  }
}
