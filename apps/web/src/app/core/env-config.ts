import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnvConfig {
  get apiBase(): string {
    const win = window as typeof window & { ENV_API_URL?: string };
    const metaEnv = (import.meta as { env?: Record<string, string> }).env ?? {};

    return win.ENV_API_URL ?? metaEnv['NG_APP_API_URL'] ?? 'http://localhost:3000';
  }
}
