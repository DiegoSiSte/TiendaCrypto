import { FormsModule } from '@angular/forms';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrowserProvider } from 'ethers';
import * as QRCode from 'qrcode';
import { OrdersService } from '../../core/orders.service';
import { PricesService } from '../../core/prices.service';
import { CartService } from '../../core/cart.service';
import { Order, Payment } from '../../core/models';
import { apiMessage } from '../../core/utils';
import { RevealDirective } from '../../shared/reveal.directive';

const DEFAULT_ADDRESSES: Record<string, string> = {
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  ETH: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  USDT: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
};

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink, RevealDirective],
  template: `
    <div class="page section container">
      <div class="section-head" appReveal>
        <div>
          <span class="eyebrow">Checkout cripto</span>
          <h1 style="font-size:clamp(2rem,4.5vw,3.4rem)">Elige tu moneda y firma.</h1>
        </div>
        <p>Precio en vivo de CoinGecko. La orden se marca como pagada cuando pegas el hash.</p>
      </div>

      @if (success(); as result) {
        <div class="glass panel" appReveal>
          <div class="alert success">Pago registrado. Orden #{{ result.order.id }} marcada como pagada.</div>
          <p style="margin:1rem 0">Tx hash: <span style="font-family:ui-monospace,monospace">{{ result.payment.txHash }}</span></p>
          <div class="hero-actions">
            <a routerLink="/ordenes" class="btn btn-primary">Ver mis órdenes</a>
            <a routerLink="/tienda" class="btn btn-ghost">Seguir comprando</a>
          </div>
        </div>
      } @else if (!cart.items().length) {
        <div class="glass empty-state" appReveal>
          <h3>No hay nada para pagar</h3>
          <p>Agrega productos al carrito antes de llegar al checkout.</p>
          <a routerLink="/tienda" class="btn btn-primary" style="margin-top:1rem">Ir a la tienda</a>
        </div>
      } @else {
        <div class="checkout-layout" appReveal>
          <div class="glass panel">
            <h2>1. Moneda de pago</h2>
            <div class="currency-grid">
              @for (option of currencies; track option.symbol) {
                <button
                  class="currency-option"
                  type="button"
                  [class.active]="currency() === option.symbol"
                  (click)="currency.set(option.symbol)"
                >
                  <img [src]="option.icon" [alt]="option.symbol" />
                  <span>{{ option.symbol }}</span>
                </button>
              }
            </div>

            <h2 style="margin-top:1.8rem">2. Dirección y monto</h2>
            <p style="font-size:0.9rem">
              Equivalente: <strong style="color:var(--neon)">{{ amountText() }}</strong> {{ currency() }}
              <span style="display:block; font-size:0.75rem">Fuente: {{ prices.source() || 'api' }}</span>
            </p>
            <div class="qr-box" style="margin:1rem 0">
              @if (qr()) {
                <img [src]="qr()" alt="Código QR de la dirección de pago" />
              } @else {
                <div class="spinner"></div>
              }
              <strong>ESCÁNEA CON TU WALLET</strong>
            </div>
            <div class="address-box">
              <span>{{ walletAddress() }}</span>
              <button class="link-action" type="button" (click)="copyAddress()">{{ copied() ? 'Copiado' : 'Copiar' }}</button>
            </div>

            <div style="margin-top:1rem">
              <button class="btn btn-ghost btn-small" type="button" (click)="connectMetaMask()">Conectar MetaMask</button>
              @if (wallet()) {
                <p style="margin-top:0.5rem; font-size:0.8rem">Wallet conectada: {{ wallet() }}</p>
              }
              @if (walletError()) {
                <p class="alert error" style="margin-top:0.5rem">{{ walletError() }}</p>
              }
            </div>

            <h2 style="margin-top:1.8rem">3. Confirma con el hash</h2>
            <div class="form-grid">
              <div class="field">
                <label for="txHash">Hash de la transacción</label>
                <input id="txHash" name="txHash" [(ngModel)]="txHash" placeholder="0x..." autocomplete="off" />
              </div>
              @if (error()) {
                <div class="alert error">{{ error() }}</div>
              }
              <button class="btn btn-primary" type="button" [disabled]="busy() || !txHash.trim()" (click)="pay()">
                {{ busy() ? 'Registrando pago…' : 'Marcar orden como pagada' }}
              </button>
            </div>
          </div>

          <aside class="glass panel">
            <h2>Tu orden</h2>
            @for (item of cart.items(); track item.product.id) {
              <div class="summary-row">
                <span>{{ item.quantity }} × {{ item.product.name }}</span>
                <span>{{ item.product.priceUsd * item.quantity }} USD</span>
              </div>
            }
            <div class="summary-row"><span>Subtotal</span><span>{{ cart.subtotal() }} USD</span></div>
            <div class="summary-row"><span>Envío</span><span>0 USD</span></div>
            <div class="summary-row total"><span>Total</span><span>{{ cart.subtotal() }} USD</span></div>
            <p style="margin-top:1rem; font-size:0.8rem">Pago simulado: no enviamos fondos reales. Guarda el hash como comprobante.</p>
          </aside>
        </div>
      }
    </div>
  `
})
export class CheckoutPage implements OnInit {
  private readonly orders = inject(OrdersService);
  readonly cart = inject(CartService);
  readonly prices = inject(PricesService);

  readonly currencies = [
    { symbol: 'BTC', icon: 'assets/coins/btc.svg' },
    { symbol: 'ETH', icon: 'assets/coins/eth.svg' },
    { symbol: 'USDT', icon: 'assets/coins/usdt.svg' }
  ];

  readonly currency = signal('BTC');
  readonly addresses = signal<Record<string, string>>(DEFAULT_ADDRESSES);
  readonly qr = signal('');
  readonly busy = signal(false);
  readonly error = signal('');
  readonly success = signal<{ order: Order; payment: Payment } | null>(null);
  readonly wallet = signal('');
  readonly walletError = signal('');
  readonly copied = signal(false);

  txHash = '';

  readonly walletAddress = computed(() => this.addresses()[this.currency()] || DEFAULT_ADDRESSES[this.currency()]);
  readonly amountText = computed(() => {
    const price = this.prices.priceFor(this.currency());
    if (!price) return '—';
    return (this.cart.subtotal() / price).toFixed(8);
  });

  constructor() {
    effect(() => {
      const symbol = this.currency();
      const address = this.walletAddress();
      const amount = this.amountText();
      const payload = `${symbol.toLowerCase()}:${address}?amount=${amount}`;
      QRCode.toDataURL(payload, {
        margin: 1,
        width: 320,
        color: { dark: '#05070f', light: '#00ff9d' }
      })
        .then((url) => this.qr.set(url))
        .catch(() => this.qr.set(''));
    });
  }

  ngOnInit(): void {
    this.prices.load();
    this.orders.addresses().subscribe({
      next: (response) => this.addresses.set({ ...DEFAULT_ADDRESSES, ...response.addresses }),
      error: () => undefined
    });
  }

  copyAddress(): void {
    void navigator.clipboard?.writeText(this.walletAddress());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }

  async connectMetaMask(): Promise<void> {
    const provider = (window as unknown as { ethereum?: unknown }).ethereum;
    if (!provider) {
      this.walletError.set('MetaMask no está instalado. Puedes pagar de todos modos copiando la dirección.');
      return;
    }
    try {
      const browserProvider = new BrowserProvider(provider as never);
      const signer = await browserProvider.getSigner();
      this.wallet.set(await signer.getAddress());
      this.walletError.set('');
    } catch {
      this.walletError.set('No se pudo conectar MetaMask. Revisa la extensión e inténtalo de nuevo.');
    }
  }

  pay(): void {
    const items = this.cart.items().map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      unitPriceUsd: item.product.priceUsd
    }));

    this.busy.set(true);
    this.error.set('');
    this.orders.create(items).subscribe({
      next: ({ order }) => {
        this.orders
          .pay({ orderId: order.id, currency: this.currency(), txHash: this.txHash.trim() })
          .subscribe({
            next: (response) => {
              this.success.set({ order: response.order, payment: response.payment });
              this.cart.clear();
              this.busy.set(false);
            },
            error: (err: unknown) => {
              this.error.set(apiMessage(err));
              this.busy.set(false);
            }
          });
      },
      error: (err: unknown) => {
        this.error.set(apiMessage(err));
        this.busy.set(false);
      }
    });
  }
}
