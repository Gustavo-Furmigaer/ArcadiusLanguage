import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  private otpCode: string | null = null;
  private expiration: number | null = null;

  // Lista de e-mails de teste que devem usar o fluxo "local" (sem enviar e-mail)
  private testEmails = [
    'teste321@email.com',
    // adicione outros e-mails de teste aqui se quiser
  ];

  // Gere e configure expiração
  private generateOtpInternal(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpCode = code;
    this.expiration = Date.now() + 5 * 60 * 1000; // 5 minutos
    console.log('[MfaService] OTP gerado:', code);
    return code;
  }

  // Inicia o fluxo MFA: guarda credenciais pendentes e envia (ou não) o e-mail
  async startMfa(email: string, password: string): Promise<void> {
    const otp = this.generateOtpInternal();

    // Guarde credenciais temporariamente (o mfa.component fará o login real após verificação)
    localStorage.setItem('pendingEmail', email);
    localStorage.setItem('pendingPassword', password);

    // Se for e-mail de teste -> não enviar, apenas expor localmente (útil para apresentação)
    if (this.isTestEmail(email)) {
      // para debug/visualização no mfa.component.html
      localStorage.setItem('otp', otp);
      console.log('[MfaService] Fluxo de teste — OTP disponível localmente.');
      return;
    }

    // Caso contrário, envie o e-mail (ex: EmailJS). Ajuste SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY
    try {
      await this.sendOtpEmail(email, otp);
      // opcional: remova o OTP de localStorage para não exibir em produção
      localStorage.removeItem('otp');
    } catch (err) {
      console.error('[MfaService] Erro ao enviar OTP por e-mail:', err);
      // Em caso de falha no envio, você pode decidir permitir o acesso de teste,
      // ou falhar o processo. Aqui apenas deixamos o OTP em memória (não em localStorage).
      throw err;
    }
  }

  // Verifica se input bate com otp (considera memória + fallback em localStorage para testes)
  verifyOtp(input: string): boolean {
    // checa validade de tempo
    if (!this.otpCode && !localStorage.getItem('otp')) return false;
    const otpToCompare = this.otpCode ?? localStorage.getItem('otp')!;
    const notExpired = !this.expiration || Date.now() < this.expiration;

    const valid = notExpired && input === otpToCompare;
    if (valid) this.clearOtp();
    return valid;
  }

  clearOtp(): void {
    this.otpCode = null;
    this.expiration = null;
    localStorage.removeItem('otp');
    // não removemos pendingEmail/pendingPassword aqui — o componente que completar o login remove
  }

  // Determina se um e-mail é de teste (comparação case-insensitive)
  private isTestEmail(email: string): boolean {
    return this.testEmails.some(e => e.toLowerCase() === (email || '').toLowerCase());
  }

  private async sendOtpEmail(toEmail: string, otp: string): Promise<void> {
    const SERVICE_ID = 'service_gb3nwh5';
    const TEMPLATE_ID = 'template_h11j5q4';
    const PUBLIC_KEY = 'JuIBmrpUPp8OKT2YL';

    const templateParams = {
      to_email: toEmail,
      passcode: otp,
      time: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString(),
    };

    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log('[MfaService] Email enviado:', response.status, response.text);
      });
  }
}
