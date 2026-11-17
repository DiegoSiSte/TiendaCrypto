import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../../core/orders.service';
import { Order } from '../../core/models';
import { apiMessage } from '../../core/utils';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, RevealDirective],
  template: `
    <div class="page section container">
      <div class="section-head" appReveal>
        <div>
          <span class="eyebrow">Historial</span>
          <h1 style="font-size:clamp(2rem,4.5vw,3.4rem)">Mis órdenes</h1>
        </div>
        <a routerLink="/tienda" class="btn btn-ghost">Nueva compra</a>
      </div>

      @if (error()) {
        <div class="alert error" style="margin-bottom:1rem">{{ error() }}</div>
      }

      @if (loading()) {
        <div class="glass panel" style="display:flex; align-items:center; gap:0.8rem">
          <div class="spinner"></div><span>Cargando órdenes…</span>
        </div>
      } @else if (orders().length) {
        <div style="display:grid; gap:1rem" appReveal>
          @for (order of orders(); track order.id) {
            <article class="glass order-card">
              <div class="order-head">
                <strong style="font-family:Orbitron,sans-serif">Orden #{{ order.id }}</strong>
                <span class="status" [class]="order.status === 'pagada' ? 'status pagada' : 'status pendiente'">
                  {{ order.status }}
                </span>
              </div>
              <div>
                @for (item of order.items; track item.id || item.productId) {
                  <div class="summary-row">
                    <span>{{ item.quantity }} × {{ item.productName || ('Producto ' + item.productId) }}</span>
                    <span>{{ item.unitPriceUsd * item.quantity }} USD</span>
                  </div>
                }
              </div>
              <div class="summary-row total"><span>Total</span><span>{{ order.totalUsd }} USD</span></div>
              @if (order.payment; as payment) {
                <p style="font-size:0.8rem">
                  {{ payment.currency }} · {{ payment.amountCrypto }} ·
                  <span style="font-family:ui-monospace,monospace">{{ payment.txHash }}</span>
                </p>
              } @else {
                <p style="font-size:0.8rem">Esta orden todavía no tiene pago registrado.</p>
              }
              <span style="font-size:0.75rem; color:var(--muted)">{{ order.createdAt }}</span>
            </article>
          }
        </div>
      } @else {
        <div class="glass empty-state" appReveal>
          <h3>Aún no tienes órdenes</h3>
          <p>Cuando compres algo, el estado y el comprobante aparecerán aquí.</p>
          <a routerLink="/tienda" class="btn btn-primary" style="margin-top:1rem">Explorar tienda</a>
        </div>
      }
    </div>
  `
})
export class OrdersPage implements OnInit {
  private readonly ordersService = inject(OrdersService);
  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.ordersService.mine().subscribe({
      next: (response) => {
        this.orders.set(response.orders || []);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(apiMessage(err, 'No se pudo cargar el historial. Revisa tu sesión.'));
        this.loading.set(false);
      }
    });
  }
}
