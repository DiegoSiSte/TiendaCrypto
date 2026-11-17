import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product } from './models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsState = signal<CartItem[]>(this.read());

  readonly items = this.itemsState.asReadonly();
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.product.priceUsd * item.quantity, 0)
  );

  add(product: Product, quantity = 1): void {
    const items = [...this.items()];
    const index = items.findIndex((item) => item.product.id === product.id);
    if (index >= 0) {
      items[index] = { ...items[index], quantity: Math.min(items[index].quantity + quantity, 99) };
    } else {
      items.push({ product, quantity });
    }
    this.set(items);
  }

  setQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.remove(productId);
      return;
    }
    this.set(
      this.items().map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(quantity, 99) } : item
      )
    );
  }

  remove(productId: number): void {
    this.set(this.items().filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this.set([]);
  }

  private set(items: CartItem[]): void {
    this.itemsState.set(items);
    localStorage.setItem('cryptodiego_cart', JSON.stringify(items));
  }

  private read(): CartItem[] {
    try {
      const raw = localStorage.getItem('cryptodiego_cart');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
