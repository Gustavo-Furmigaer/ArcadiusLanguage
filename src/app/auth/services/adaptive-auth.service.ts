import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdaptiveAuthService {
  private loginAttempts: Record<string, { count: number; lastAttempt: number }> = {};

  shouldTriggerMFA(email: string): boolean {
    const userData = this.loginAttempts[email];
    if (!userData) return false;

    // Exemplo: se o usuário tentou muitas vezes em pouco tempo
    const recentAttempts = Date.now() - userData.lastAttempt < 5 * 60 * 1000; // 5 minutos
    return userData.count > 2 && recentAttempts;
  }

  recordLoginAttempt(email: string, success: boolean): void {
    const now = Date.now();
    if (!this.loginAttempts[email]) {
      this.loginAttempts[email] = { count: 0, lastAttempt: now };
    }

    if (success) {
      this.loginAttempts[email] = { count: 0, lastAttempt: now };
    } else {
      this.loginAttempts[email].count++;
      this.loginAttempts[email].lastAttempt = now;
    }
  }

  getRiskLevel(email: string, ipRegion?: string): string {
    // 🧩 Aqui você pode aplicar lógica real de risco:
    // localização, horário, dispositivo, etc.
    if (this.shouldTriggerMFA(email)) return 'alto';
    return 'baixo';
  }
}
