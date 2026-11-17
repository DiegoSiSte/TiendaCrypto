import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { CartService } from '../../core/cart.service';
import { DEMO_PRODUCTS } from '../../core/fallback-data';
import { Product } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';
import { TiltDirective } from '../../shared/tilt.directive';

@Component({
  selector: 'app-product',
  imports: [RouterLink, RevealDirective, TiltDirective],
  template: `
    <div class="page section container">
      <a routerLink="/tienda" class="link-action" style="display:inline-block; margin-bottom:1.5rem">Volver a la tienda</a>

      @if (product(); as item) {
        <div class="checkout-layout" appReveal>
          <div class="glass panel card-3d" appTilt style="display:grid; place-items:center">
            <img [src]="item.imageUrl" [alt]="item.name" style="width:min(100%,420px); aspect-ratio:4/3; object-fit:contain" />
          </div>
          <div class="glass panel">
            <span class="eyebrow">{{ item.categoryName }}</span>
            <h1 style="font-size:clamp(1.8rem,4vw,2.8rem); margin:1rem 0">{{ item.name }}</h1>
            <p>{{ item.description }}</p>
            <div class="summary-row" style="margin-top:1.5rem">
              <span>Precio</span><strong class="product-price">{{ item.priceUsd }} USD</strong>
            </div>
            <div class="summary-row"><span>Stock</span><span>{{ item.stock }} unidades</span></div>
            <div class="hero-actions">
              <button class="btn btn-primary" type="button" (click)="add(item)">Agregar al carrito</button>
              <a routerLink="/carrito" class="btn btn-ghost">Ver carrito</a>
            </div>
            <p style="margin-top:1.2rem; font-size:0.85rem">Pago simulado con BTC, ETH o USDT. Recibirás la dirección y el QR en el checkout.</p>
          </div>
        </div>
      } @else {
        <div class="glass empty-state">
          <h3>Producto no encontrado</h3>
          <p>Es posible que ya no esté disponible.</p>
        </div>
      }
    </div>
  `
})
export class ProductPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  readonly product = signal<Product | null>(DEMO_PRODUCTS.find((item) => item.id === this.id) || null);

  ngOnInit(): void {
    if (!this.id) return;
    this.catalog.product(this.id).subscribe({
      next: (response) => this.product.set(response.product),
      error: () => undefined
    });
  }

  add(product: Product): void {
    this.cart.add(product);
  }
}
