import { FormsModule } from '@angular/forms';
import { Component, ElementRef, ViewChild, effect, inject, signal } from '@angular/core';
import { ChatService } from '../core/chat.service';
import { ChatEntry } from '../core/models';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (open()) {
      <section class="chat-panel glass" aria-label="Asistente de CryptoDiego">
        <div class="chat-head">
          <div>
            <strong>Asistente CryptoDiego</strong>
            <span>En línea · responde en español</span>
          </div>
          <button type="button" class="link-action" aria-label="Cerrar chat" (click)="open.set(false)">✕</button>
        </div>

        <div #thread class="chat-thread" role="log" aria-live="polite">
          @for (message of messages(); track $index) {
            <div class="bubble" [class]="message.role === 'user' ? 'bubble user' : 'bubble assistant'">
              {{ message.content }}
            </div>
          }
          @if (typing()) {
            <div class="bubble assistant typing"><i></i><i></i><i></i></div>
          }
        </div>

        <div class="chat-quick">
          @for (prompt of prompts; track prompt) {
            <button type="button" (click)="quickAsk(prompt)">{{ prompt }}</button>
          }
        </div>

        <form class="chat-form" (ngSubmit)="send()">
          <input
            name="draft"
            [(ngModel)]="draft"
            placeholder="Pregunta sobre CryptoDiego"
            autocomplete="off"
            aria-label="Mensaje para el asistente"
          />
          <button class="btn btn-primary btn-small" type="submit" [disabled]="typing() || !draft.trim()">
            Enviar
          </button>
        </form>
      </section>
    }

    <button
      class="chat-bubble"
      type="button"
      [attr.aria-label]="open() ? 'Cerrar asistente' : 'Abrir asistente'"
      (click)="toggle()"
    >
      {{ open() ? '×' : '◈' }}
    </button>
  `
})
export class ChatWidgetComponent {
  @ViewChild('thread') private thread?: ElementRef<HTMLDivElement>;

  private readonly chat = inject(ChatService);
  readonly open = signal(false);
  readonly typing = signal(false);
  readonly messages = signal<ChatEntry[]>([
    {
      role: 'assistant',
      content: 'Hola. Soy el asistente de CryptoDiego. Pregúntame por servicios, tienda, pagos, noticias, cuentas u órdenes.'
    }
  ]);

  readonly prompts = ['¿Qué servicios ofrecen?', '¿Cómo pago con cripto?', '¿Qué monedas aceptan?'];
  draft = '';

  constructor() {
    effect(() => {
      const request = this.chat.openRequest();
      if (request) {
        queueMicrotask(() => {
          this.draft = request;
          this.open.set(true);
          this.chat.consumeRequest();
        });
      }
    });
  }

  toggle(): void {
    this.open.set(!this.open());
    if (this.open()) this.scrollToBottom();
  }

  quickAsk(prompt: string): void {
    this.draft = prompt;
    this.send();
  }

  send(): void {
    const message = this.draft.trim();
    if (!message || this.typing()) return;

    this.messages.update((items) => [...items, { role: 'user', content: message }]);
    this.draft = '';
    this.typing.set(true);
    this.scrollToBottom();

    const history: ChatEntry[] = this.messages().slice(-7, -1);
    this.chat.send(message, history).subscribe({
      next: (response) => {
        this.messages.update((items) => [...items, { role: 'assistant', content: response.reply }]);
        this.typing.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.messages.update((items) => [
          ...items,
          { role: 'assistant', content: 'No pude conectar con el asistente. Intenta de nuevo en unos segundos.' }
        ]);
        this.typing.set(false);
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const node = this.thread?.nativeElement;
      if (node) node.scrollTop = node.scrollHeight;
    }, 40);
  }
}
