import { Injectable, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { ChatEntry } from './models';

export interface ChatResponse {
  reply: string;
  source: string;
  saved: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly api = inject(ApiService);
  private readonly requestState = signal<string | null>(null);

  readonly openRequest = this.requestState.asReadonly();

  send(message: string, history: ChatEntry[]) {
    return this.api.post<ChatResponse>('/chat', { message, history }).pipe(
      catchError(() => of(this.fallback(message)))
    );
  }

  request(message: string): void {
    this.requestState.set(message);
  }

  consumeRequest(): void {
    this.requestState.set(null);
  }

  private fallback(message: string): ChatResponse {
    const text = message.toLowerCase();
    let reply = 'Soy el asistente de CryptoDiego. Puedo ayudarte con servicios, tienda, pagos cripto, precios y noticias.';

    if (/(pago|pagar|checkout|btc|eth|usdt|direccion|dirección|hash|qr|transferencia)/.test(text)) {
      reply = 'En checkout eliges BTC, ETH o USDT, ves el monto convertido, copias la dirección, escaneas el QR y pegas el hash.';
    } else if (/(precio|precios|cotiz|bitcoin|ethereum|mercado)/.test(text)) {
      reply = 'Los precios se actualizan desde CoinGecko; si la API no responde, mostramos una cotización de referencia.';
    } else if (/(noticia|noticias|news|blog)/.test(text)) {
      reply = 'En Noticias ves el feed cripto del momento; si la fuente falla, mostramos titulares de respaldo.';
    } else if (/(cuenta|login|registro|registrarme|contraseña|password|perfil)/.test(text)) {
      reply = 'Puedes crear cuenta o entrar desde Acceder. El registro y el login requieren el backend de CryptoDiego.';
    } else if (/(orden|pedido|compra|carrito|envio|envío)/.test(text)) {
      reply = 'Agrega productos al carrito y finaliza en Checkout para generar una orden con pago cripto.';
    } else if (/(servicio|servicios|consultoria|consultoría|auditoria|auditoría)/.test(text)) {
      reply = 'Ofrecemos consultoría, auditoría, integración de pagos y acompañamiento cripto desde la sección Servicios.';
    } else if (/(tienda|producto|productos|merch|curso|wallet)/.test(text)) {
      reply = 'En la Tienda encontrarás wallets, merch, cursos y accesorios pagables con BTC, ETH o USDT.';
    }

    return { reply, source: 'fallback', saved: false };
  }
}
