import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CatalogService } from '../../core/catalog.service';
import { NewsItem } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'local-1',
    title: 'Cómo elegir un hardware wallet sin caer en el hype',
    url: '',
    source: 'CryptoDiego',
    published: null,
    body: 'Revisa soporte de activos, código abierto, passphrase y una prueba de recuperación antes de depositar fondos.'
  },
  {
    id: 'local-2',
    title: 'Checkout con cripto: por qué el hash es tu comprobante',
    url: '',
    source: 'CryptoDiego',
    published: null,
    body: 'El hash identifica la transacción en la red. Pégalo en el checkout para marcar tu orden como pagada.'
  }
];

@Component({
  selector: 'app-news',
  imports: [RevealDirective, DatePipe],
  template: `
    <div class="page section container">
      <div class="section-head" appReveal>
        <div>
          <span class="eyebrow">Noticias</span>
          <h1 style="font-size:clamp(2rem,4.5vw,3.4rem)">Señal, no ruido.</h1>
        </div>
        <p>Titulares cripto de una API pública, cacheados 10 minutos. Fuente: {{ source() }}.</p>
      </div>

      @if (stale()) {
        <div class="alert" style="margin-bottom:1rem">Mostrando las noticias disponibles más recientes mientras se restablece la fuente.</div>
      }

      <div class="news-grid" appReveal>
        @for (item of news(); track item.id) {
          <article class="glass news-card">
            <h3>
              @if (item.url.startsWith('http')) {
                <a [href]="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
              } @else {
                {{ item.title }}
              }
            </h3>
            <p style="font-size:0.88rem">{{ item.body || 'Sin resumen disponible.' }}</p>
            <div class="news-meta">
              <span>{{ item.source }}</span>
              <span>{{ item.published ? (item.published | date: 'dd MMM HH:mm') : 'Reciente' }}</span>
            </div>
          </article>
        }
      </div>
    </div>
  `
})
export class NewsPage implements OnInit {
  private readonly catalog = inject(CatalogService);
  readonly news = signal<NewsItem[]>(FALLBACK_NEWS);
  readonly source = signal('CryptoDiego');
  readonly stale = signal(false);

  ngOnInit(): void {
    this.catalog.news().subscribe({
      next: (response) => {
        if (response.news?.length) this.news.set(response.news.slice(0, 12));
        this.source.set(response.source || 'API');
        this.stale.set(Boolean(response.stale));
      },
      error: () => undefined
    });
  }
}
