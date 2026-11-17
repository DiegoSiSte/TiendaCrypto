import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Order, OrderItem, Payment } from './models';

export interface PaymentRequest {
  orderId: number;
  currency: string;
  txHash: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly api = inject(ApiService);

  create(items: OrderItem[]) {
    return this.api.post<{ order: Order }>('/orders', { items });
  }

  mine() {
    return this.api.get<{ orders: Order[] }>('/orders/me');
  }

  payment(orderId: number) {
    return this.api.get<{ payment: Payment; order: Order }>(`/payments/${orderId}`);
  }

  pay(payload: PaymentRequest) {
    return this.api.post<{ payment: Payment; order: Order; alreadyPaid: boolean }>('/payments', payload);
  }

  addresses() {
    return this.api.get<{ addresses: Record<string, string> }>('/payments/addresses');
  }
}
