import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  private otpCode: string | null = null;
  private expiresAt: number | null = null;

  generateOtp(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpCode = code;
    this.expiresAt = Date.now() + 60 * 1000; // expira em 60 segundos
    console.log('🔐 Código MFA gerado (simulado):', code);
    return code;
  }

  verifyOtp(input: string): boolean {
    if (!this.otpCode || !this.expiresAt) return false;
    if (Date.now() > this.expiresAt) {
      console.warn('⚠️ Código expirado!');
      this.clearOtp();
      return false;
    }
    return input === this.otpCode;
  }

  clearOtp(): void {
    this.otpCode = null;
    this.expiresAt = null;
  }
}
