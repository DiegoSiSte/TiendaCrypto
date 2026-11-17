import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { ChatService } from '../../core/chat.service';
import { DEMO_SERVICES } from '../../core/fallback-data';
import { PricesService } from '../../core/prices.service';
import { Service } from '../../core/models';
import { CountUpDirective } from '../../shared/count-up.directive';
import { RevealDirective } from '../../shared/reveal.directive';
import { TiltDirective } from '../../shared/tilt.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CountUpDirective, RevealDirective, TiltDirective],
  template: `
    <div class="page">
      <section class="hero">
        <video
          class="hero-video"
          [class.hidden]="videoFailed()"
          src="assets/videos/hero.mp4"
          autoplay
          muted
          loop
          playsinline
          (error)="videoFailed.set(true)"
        ></video>

        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="eyebrow">Plataforma cripto · precio en vivo</span>
            <h1>Tu stack cripto, <em>sin ruido.</em></h1>
            <p>
              Servicios, tienda y pagos con BTC, ETH o USDT en un solo lugar. Trae tu plan,
              nosotros ponemos la carretera. Diamond hands también necesitan un buen mapa.
            </p>
            <div class="hero-actions">
              <a routerLink="/servicios" class="btn btn-primary">Explorar servicios</a>
              <a routerLink="/tienda" class="btn btn-ghost">Ver la tienda</a>
            </div>
            <div class="hero-stats">
              <div class="stat"><strong [appCountUp]="8">8</strong><span>servicios activos</span></div>
              <div class="stat"><strong [appCountUp]="15">15</strong><span>productos</span></div>
              <div class="stat"><strong [appCountUp]="3">3</strong><span>monedas aceptadas</span></div>
              <div class="stat"><strong [appCountUp]="10">10</strong><span>min de caché</span></div>
            </div>
          </div>

          <div class="hero-visual" aria-hidden="true">
            <img class="coin coin-btc" src="assets/coins/btc.svg" alt="" />
            <img class="coin coin-eth" src="assets/coins/eth.svg" alt="" />
            <img class="coin coin-usdt" src="assets/coins/usdt.svg" alt="" />
            <div class="hero-orbit">
              <div class="orbit-core">HODL</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section container" appReveal>
        <div class="section-head">
          <div>
            <span class="eyebrow">Mercado</span>
            <h2>Top 10 ahora</h2>
          </div>
          <p>Precios de CoinGecko con caché de 10 minutos. El ticker de arriba se actualiza solo.</p>
        </div>
        <div class="product-grid">
          @for (coin of prices.prices().slice(0, 10); track coin.id) {
            <article class="glass service-card" style="min-height:auto; gap:0.5rem">
              <span class="ticker-symbol">{{ coin.symbol }} · {{ coin.name }}</span>
              <strong style="font-family:Orbitron,sans-serif; font-size:1.05rem">{{ format(coin.currentPrice) }}</strong>
              <span [class]="coin.priceChange24h >= 0 ? 'up' : 'down'" style="font-size:0.8rem">
                {{ coin.priceChange24h >= 0 ? '▲' : '▼' }} {{ Math.abs(coin.priceChange24h).toFixed(2) }}% en 24 h
              </span>
            </article>
          }
        </div>
      </section>

      <section class="section container" id="servicios" appReveal>
        <div class="section-head">
          <div>
            <span class="eyebrow">Lo que hacemos</span>
            <h2>Servicios para tu próximo nivel</h2>
          </div>
          <p>De la primera wallet a la auditoría del contrato. Sin humo, con entregables claros.</p>
        </div>
        <div class="services-grid">
          @for (service of services().slice(0, 6); track service.id) {
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
      </section>

      <section class="section container" appReveal>
        <div class="section-head">
          <div>
            <span class="eyebrow">Cómo funciona</span>
            <h2>De la orden al hash en cinco pasos</h2>
          </div>
        </div>
        <div class="steps">
          <article class="glass step"><h3>Elige producto</h3><p>Agrega lo que quieras al carrito y revisa el total en USD.</p></article>
          <article class="glass step"><h3>Selecciona moneda</h3><p>BTC, ETH o USDT. Ves el equivalente con el precio de CoinGecko.</p></article>
          <article class="glass step"><h3>Copia o escanea</h3><p>Dirección y QR listos para tu wallet. Revisa la red antes de firmar.</p></article>
          <article class="glass step"><h3>Pega el hash</h3><p>Copia el tx_hash de tu transacción y confírmalo en el checkout.</p></article>
          <article class="glass step"><h3>Sigue tu orden</h3><p>La orden pasa a pagada y queda en tu historial con el comprobante.</p></article>
        </div>
      </section>

      <section class="section container" appReveal>
        <div class="glass panel" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1.5rem">
          <div>
            <span class="eyebrow"> Únete al crew</span>
            <h2 style="margin-top:0.8rem">Empieza con un plan, no con un meme.</h2>
            <p style="margin-top:0.6rem">Crea tu cuenta, guarda tus órdenes y paga con cripto en minutos.</p>
          </div>
          <div class="hero-actions">
            <a routerLink="/auth" class="btn btn-violet">Crear cuenta</a>
            <a routerLink="/noticias" class="btn btn-ghost">Leer noticias</a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomePage implements OnInit {
  readonly prices = inject(PricesService);
  private readonly catalog = inject(CatalogService);
  private readonly chat = inject(ChatService);
  readonly Math = Math;
  readonly videoFailed = signal(false);
  readonly services = signal<Service[]>(DEMO_SERVICES);

  ngOnInit(): void {
    this.prices.load();
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

  format(value: number): string {
    const digits = value < 1 ? 4 : 2;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(value);
  }
}
