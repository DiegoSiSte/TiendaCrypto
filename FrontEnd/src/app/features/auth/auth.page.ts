import { FormsModule } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { apiMessage } from '../../core/utils';

@Component({
  selector: 'app-auth',
  imports: [FormsModule],
  template: `
    <div class="page auth-wrap">
      <div class="glass auth-card">
        <span class="eyebrow">Acceso</span>
        <h1 style="font-size:1.8rem; margin-top:0.8rem">
          {{ mode() === 'login' ? 'Vuelve al stack' : 'Crea tu cuenta' }}
        </h1>
        <p style="font-size:0.9rem; margin-top:0.5rem">
          {{ mode() === 'login' ? 'Entra para ver tus órdenes y pagar con cripto.' : 'Guarda tu historial y checkout en minutos.' }}
        </p>

        <div class="auth-tabs">
          <button type="button" [class.active]="mode() === 'login'" (click)="setMode('login')">Iniciar sesión</button>
          <button type="button" [class.active]="mode() === 'register'" (click)="setMode('register')">Registro</button>
        </div>

        <form class="form-grid" (ngSubmit)="submit()">
          @if (mode() === 'register') {
            <div class="field">
              <label for="name">Nombre</label>
              <input id="name" name="name" [(ngModel)]="name" autocomplete="name" required />
            </div>
          }
          <div class="field">
            <label for="email">Correo</label>
            <input id="email" name="email" type="email" [(ngModel)]="email" autocomplete="email" required />
          </div>
          <div class="field">
            <label for="password">Contraseña</label>
            <input id="password" name="password" type="password" [(ngModel)]="password" autocomplete="current-password" required />
          </div>
          @if (error()) {
            <div class="alert error">{{ error() }}</div>
          }
          <button class="btn btn-primary" type="submit" [disabled]="busy()">
            {{ busy() ? 'Un momento…' : mode() === 'login' ? 'Entrar' : 'Crear cuenta' }}
          </button>
        </form>

        <p style="margin-top:1.2rem; font-size:0.75rem">Demo: diego@cryptodiego.io / Demo1234!</p>
      </div>
    </div>
  `
})
export class AuthPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly mode = signal<'login' | 'register'>('login');
  readonly busy = signal(false);
  readonly error = signal('');

  name = '';
  email = '';
  password = '';

  setMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.error.set('');
  }

  submit(): void {
    this.busy.set(true);
    this.error.set('');
    const request =
      this.mode() === 'login'
        ? this.auth.login(this.email, this.password)
        : this.auth.register(this.name, this.email, this.password);

    request.subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/ordenes';
        void this.router.navigateByUrl(returnUrl);
        this.busy.set(false);
      },
      error: (err: unknown) => {
        this.error.set(apiMessage(err, 'No se pudo completar la operación.'));
        this.busy.set(false);
      }
    });
  }
}
