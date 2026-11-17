import { HttpErrorResponse } from '@angular/common/http';

export function apiMessage(error: unknown, fallback = 'No se pudo completar la operación.'): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { error?: string } | null;
    return body?.error || fallback;
  }
  return fallback;
}
