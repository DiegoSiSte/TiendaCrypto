import { FormsModule } from '@angular/forms';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { CartService } from '../../core/cart.service';
import { DEMO_PRODUCTS } from '../../core/fallback-data';
import { Product } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';
import { TiltDirective } from '../../shared/tilt.directive';

const CATEGORIES = [
  { slug: '', label: 'Todo' },
  { slug: 'hardware-wallets', label: 'Hardware wallets' },
  { slug: 'merch', label: 'Merch' },
  { slug: 'cursos', label: 'Cursos' },
  { slug: 'accesorios', label: 'Accesorios' }
];

@Component({
  selector: 'app-shop',
  imports: [FormsModule, RouterLink, RevealDirective, TiltDirective],
  template: `
    <div class="page section container">
      <div class="section-head" appReveal>
        <div>
          <span class="eyebrow">Tienda</span>
          <h1 style="font-size:clamp(2rem,4.5vw,3.4rem)">Gear que aguanta el bear.</h1>
        </div>
        <p>Wallets, merch y cursos. Todo se paga con cripto: BTC, ETH o USDT.</p>
      </div>

      <div class="filters" appReveal>
        @for (category of categories; track category.slug) {
          <button
            class="filter-chip"
            type="button"
            [class.active]="categorySlug() === category.slug"
            (click)="categorySlug.set(category.slug)"
          >
            {{ category.label }}
          </button>
        }
      </div>

      <div class="field" style="max-width:360px; margin-bottom:1.6rem" appReveal>
        <input
          name="search"
          [(ngModel)]="search"
          (ngModelChange)="refresh()"
          placeholder="Buscar producto"
          aria-label="Buscar producto"
        />
      </div>

      @if (toast()) {
        <div class="alert success" style="margin-bottom:1rem">{{ toast() }}</div>
      }

      <div class="product-grid" appReveal>
        @for (product of visibleProducts(); track product.id) {
          <article class="glass product-card card-3d" appTilt>
            <a [routerLink]="['/tienda', product.id]" class="product-image">
              <img [src]="product.imageUrl" [alt]="product.name" />
              @if (product.badge) {
                <span class="product-badge">{{ product.badge }}</span>
              }
            </a>
            <div class="product-body">
              <span style="font-size:0.72rem; color:var(--muted)">{{ product.categoryName }}</span>
              <a [routerLink]="['/tienda', product.id]"><h3>{{ product.name }}</h3></a>
              <p>{{ product.description }}</p>
              <div class="product-footer">
                <span class="product-price">{{ product.priceUsd }} USD</span>
                <button class="btn btn-primary btn-small" type="button" (click)="add(product)">Agregar</button>
              </div>
            </div>
          </article>
        } @empty {
          <div class="glass empty-state" style="grid-column:1/-1">
            <h3>No encontramos productos</h3>
            <p>Prueba con otra búsqueda o cambia de categoría.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ShopPage implements OnInit {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);

  readonly categories = CATEGORIES;
  readonly products = signal<Product[]>(DEMO_PRODUCTS);
  readonly categorySlug = signal('');
  readonly toast = signal('');
  private readonly searchSignal = signal('');
  search = '';
  readonly visibleProducts = computed(() => {
    const term = this.searchSignal().trim().toLowerCase();
    return this.products().filter((product) => {
      const inCategory = !this.categorySlug() || product.categorySlug === this.categorySlug();
      const inSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        (product.description || '').toLowerCase().includes(term);
      return inCategory && inSearch;
    });
  });

  ngOnInit(): void {
    this.catalog.products().subscribe({
      next: (response) => {
        if (response.products?.length) this.products.set(response.products);
      },
      error: () => undefined
    });
  }

  refresh(): void {
    this.searchSignal.set(this.search);
  }

  add(product: Product): void {
    this.cart.add(product);
    this.toast.set(`${product.name} está en el carrito.`);
    setTimeout(() => this.toast.set(''), 2500);
  }
}
