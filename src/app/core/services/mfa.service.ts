import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  private otpCode: string | null = null;

  generateOtp(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpCode = code;
    console.log('Código MFA gerado:', code);
    return code;
  }

  verifyOtp(input: string): boolean {
    return input === this.otpCode;
  }

  clearOtp(): void {
    this.otpCode = null;
  }
}
