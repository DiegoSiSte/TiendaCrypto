import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { PricesService } from '../core/prices.service';
import { Price } from '../core/models';

@Component({
  selector: 'app-price-ticker',
  standalone: true,
  template: `
    <div class="ticker" aria-label="Precios de criptomonedas en vivo">
      <div class="ticker-track">
        @for (coin of items(); track coin.symbol + '-' + $index) {
          <span class="ticker-item">
            @if (coin.image) {
              <img [src]="coin.image" [alt]="coin.name" width="18" height="18" />
            } @else {
              <span class="ticker-symbol">◆</span>
            }
            <span class="ticker-symbol">{{ coin.symbol }}</span>
            <span class="ticker-price">{{ format(coin.currentPrice) }}</span>
            <span [class]="coin.priceChange24h >= 0 ? 'up' : 'down'">
              {{ coin.priceChange24h >= 0 ? '▲' : '▼' }} {{ Math.abs(coin.priceChange24h).toFixed(2) }}%
            </span>
          </span>
        }
      </div>
    </div>
  `
})
export class PriceTickerComponent implements OnInit {
  private readonly prices = inject(PricesService);
  private readonly destroyRef = inject(DestroyRef);
  readonly Math = Math;

  readonly items = computed<Price[]>(() => {
    const list = this.prices.prices();
    return [...list, ...list];
  });

  ngOnInit(): void {
    this.prices.load();
    const timer = window.setInterval(() => this.prices.load(), 60_000);
    this.destroyRef.onDestroy(() => window.clearInterval(timer));
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
