import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, RevealDirective],
  template: `
    <div class="page section container">
      <div class="section-head" appReveal>
        <div>
          <span class="eyebrow">Tu carrito</span>
          <h1 style="font-size:clamp(2rem,4.5vw,3.4rem)">{{ cart.count() }} artículos</h1>
        </div>
        <a routerLink="/tienda" class="btn btn-ghost">Seguir comprando</a>
      </div>

      @if (cart.items().length) {
        <div class="checkout-layout" appReveal>
          <div class="cart-list">
            @for (item of cart.items(); track item.product.id) {
              <article class="glass cart-row">
                <img [src]="item.product.imageUrl" [alt]="item.product.name" />
                <div>
                  <h3 style="font-family:'Space Grotesk',sans-serif">{{ item.product.name }}</h3>
                  <span style="font-size:0.82rem; color:var(--muted)">{{ item.product.priceUsd }} USD c/u</span>
                  <div class="qty" style="margin-top:0.5rem">
                    <button type="button" aria-label="Quitar una unidad" (click)="cart.setQuantity(item.product.id, item.quantity - 1)">−</button>
                    <span>{{ item.quantity }}</span>
                    <button type="button" aria-label="Agregar una unidad" (click)="cart.setQuantity(item.product.id, item.quantity + 1)">+</button>
                  </div>
                </div>
                <strong class="cart-price product-price">{{ item.product.priceUsd * item.quantity }} USD</strong>
                <button class="link-action" type="button" (click)="cart.remove(item.product.id)">Quitar</button>
              </article>
            }
          </div>

          <aside class="glass panel">
            <h2>Resumen</h2>
            <div class="summary-row"><span>Subtotal</span><span>{{ cart.subtotal() }} USD</span></div>
            <div class="summary-row"><span>Envío</span><span>Se calcula en checkout</span></div>
            <div class="summary-row total"><span>Total estimado</span><span>{{ cart.subtotal() }} USD</span></div>
            <a routerLink="/checkout" class="btn btn-primary" style="width:100%; margin-top:1.2rem">Pagar con cripto</a>
            <p style="margin-top:0.8rem; font-size:0.8rem">Necesitas una cuenta para crear la orden y registrar el pago.</p>
          </aside>
        </div>
      } @else {
        <div class="glass empty-state" appReveal>
          <h3>Tu carrito está vacío</h3>
          <p>Hay wallets, merch y cursos esperando. El primer paso es explorar.</p>
          <a routerLink="/tienda" class="btn btn-primary" style="margin-top:1rem">Ir a la tienda</a>
        </div>
      }
    </div>
  `
})
export class CartPage {
  readonly cart = inject(CartService);
}
