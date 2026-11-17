import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Price } from './models';

const FALLBACK: Price[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', currentPrice: 65016, priceChange24h: 1.19, marketCap: 0, image: '' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', currentPrice: 1824, priceChange24h: 1.17, marketCap: 0, image: '' },
  { id: 'tether', symbol: 'USDT', name: 'Tether', currentPrice: 1, priceChange24h: 0.01, marketCap: 0, image: '' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', currentPrice: 592, priceChange24h: 0.85, marketCap: 0, image: '' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', currentPrice: 74, priceChange24h: 4.15, marketCap: 0, image: '' }
];

@Injectable({ providedIn: 'root' })
export class PricesService {
  private readonly api = inject(ApiService);
  private readonly state = signal<Price[]>([]);
  private readonly loadingState = signal(false);
  private readonly sourceState = signal<string>('');

  readonly prices = this.state.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly source = this.sourceState.asReadonly();

  load(): void {
    if (this.loadingState()) return;
    this.loadingState.set(true);
    this.api
      .get<{ prices: Price[]; source: string }>('/prices')
      .subscribe({
        next: (response) => {
          this.state.set(response.prices?.length ? response.prices : FALLBACK);
          this.sourceState.set(response.source || 'api');
          this.loadingState.set(false);
        },
        error: () => {
          this.state.set(FALLBACK);
          this.sourceState.set('fallback');
          this.loadingState.set(false);
        }
      });
  }

  priceFor(symbol: string): number | null {
    return this.state().find((price) => price.symbol === symbol.toUpperCase())?.currentPrice || null;
  }
}
