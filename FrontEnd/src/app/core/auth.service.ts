import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, AuthUser } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly userState = signal<AuthUser | null>(this.readUser());

  readonly user = this.userState.asReadonly();
  readonly isLoggedIn = computed(() => Boolean(this.userState() || this.api.token()));

  register(name: string, email: string, password: string) {
    return this.api
      .post<AuthResponse>('/auth/register', { name, email, password })
      .pipe(tap((response) => this.saveSession(response)));
  }

  login(email: string, password: string) {
    return this.api
      .post<AuthResponse>('/auth/login', { email, password })
      .pipe(tap((response) => this.saveSession(response)));
  }

  logout(): void {
    localStorage.removeItem('cryptodiego_token');
    localStorage.removeItem('cryptodiego_user');
    this.userState.set(null);
    void this.router.navigate(['/']);
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem('cryptodiego_token', response.token);
    localStorage.setItem('cryptodiego_user', JSON.stringify(response.user));
    this.userState.set(response.user);
  }

  private readUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem('cryptodiego_user');
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
