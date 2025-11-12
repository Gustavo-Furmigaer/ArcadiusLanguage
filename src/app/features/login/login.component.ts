import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FirebaseError } from 'firebase/app';
import { RecaptchaService } from '../../auth/services/recaptcha.service';
import { MfaService } from '../../core/services/mfa.service';
import { AdaptiveAuthService } from '../../auth/services/adaptive-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [FormBuilder],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  authError: string = '';


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private recaptcha: RecaptchaService,
    private mfaservice: MfaService,
    private adaptiveAuth: AdaptiveAuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  debugClick() {
    console.log('[LoginComponent] Botão clicado!');
  }
  get f() { return this.loginForm.controls; }

async onSubmit() {
  console.log('[LoginComponent] onSubmit chamado');
  this.submitted = true;
  this.authError = '';

  if (this.loginForm.invalid) {
    console.warn('Formulário inválido. Verifique os campos.');
    console.log('Erros no campo Email:', this.loginForm.get('email')?.errors);
    console.log('Erros no campo Senha:', this.loginForm.get('password')?.errors);
    return;
  }

  const email = this.f['email'].value;
  const password = this.f['password'].value;

  console.log('Formulário válido. Executando reCAPTCHA...');
  try {
    const token = await this.recaptcha.execute('login');
    console.log('[LoginComponent] Token reCAPTCHA:', token);

    // ⚙️ Não faz login completo aqui — apenas inicia MFA
    console.log('[LoginComponent] Iniciando fluxo MFA...');
    await this.mfaservice.startMfa(email, password);

    // ✅ Redireciona para a página MFA
    this.router.navigate(['/mfa']);
  } catch (error: any) {
    console.error('[LoginComponent] Erro ao iniciar MFA:', error);

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          this.authError = 'Senha incorreta.';
          break;
        case 'auth/user-not-found':
          this.authError = 'Usuário não encontrado.';
          break;
        case 'auth/too-many-requests':
          this.authError = 'Muitas tentativas. Tente novamente em alguns minutos.';
          break;
        default:
          this.authError = 'Erro ao fazer login. Tente novamente.';
          break;
      }
    } else if (error.message?.includes('Muitas tentativas')) {
      this.authError = 'Muitas tentativas. Tente novamente em alguns minutos.';
    } else {
      this.authError = 'Erro inesperado.';
      console.error('Erro desconhecido no login:', error);
    }
  }
}
}
