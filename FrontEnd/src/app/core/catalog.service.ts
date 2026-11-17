import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { NewsItem, Product, Service } from './models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly api = inject(ApiService);

  services() {
    return this.api.get<{ services: Service[] }>('/services');
  }

  products(filters?: { category?: string; search?: string }) {
    return this.api.get<{ products: Product[] }>('/products', filters);
  }

  product(id: number) {
    return this.api.get<{ product: Product }>(`/products/${id}`);
  }

  news() {
    return this.api.get<{ news: NewsItem[]; source: string; stale: boolean }>('/news');
  }
}
