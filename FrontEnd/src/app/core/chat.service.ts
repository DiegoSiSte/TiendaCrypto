import { Injectable, inject, signal } from '@angular/core';
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
    return this.api.post<ChatResponse>('/chat', { message, history });
  }

  request(message: string): void {
    this.requestState.set(message);
  }

  consumeRequest(): void {
    this.requestState.set(null);
  }
}
