import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MfaService } from '../../core/services/mfa.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.css']
})
export class MfaComponent {
  userCode: string = '';
  errorMessage: string = '';
  otpVisible = localStorage.getItem('otp'); // apenas para debug visual

  constructor(
    private mfaService: MfaService,
    private authService: AuthService,
    private router: Router
  ) {}

  async verify() {
    if (this.mfaService.verifyOtp(this.userCode)) {
      try {
        // ✅ Faz o login REAL após o MFA
        const email = localStorage.getItem('pendingEmail');
        const password = localStorage.getItem('pendingPassword');

        if (!email || !password) {
          this.errorMessage = 'Sessão MFA expirada. Faça login novamente.';
          this.router.navigate(['/index/login']);
          return;
        }

        await this.authService.login(email, password);
        this.mfaService.clearOtp();
        localStorage.removeItem('otp');
        localStorage.removeItem('pendingEmail');
        localStorage.removeItem('pendingPassword');

        alert('✅ MFA verificado e login concluído!');
        this.router.navigate(['/index/games']);
      } catch (error: any) {
        console.error('[MfaComponent] Erro ao completar login:', error);
        this.errorMessage = 'Erro ao completar o login. Tente novamente.';
      }
    } else {
      this.errorMessage = 'Código incorreto ou expirado. Tente novamente.';
    }
  }
}
