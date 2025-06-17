import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  debugClick() {
    console.log('[LoginComponent] Botão clicado!');
  }


  get f() { return this.loginForm.controls; }

  async onSubmit() {
    console.log('[LoginComponent] onSubmit chamado');

    if (this.loginForm.invalid) {
      console.warn('Formulário inválido. Verifique os campos.');
      console.log('Erros no campo Email:', this.loginForm.get('email')?.errors);
      console.log('Erros no campo Senha:', this.loginForm.get('password')?.errors);
      return;
    }
    
     // 2. Se o código chegou até aqui, o formulário é VÁLIDO.
    console.log('Formulário válido. Enviando para o serviço de login...');
    console.log('Valores:', this.loginForm.value); // Ótimo para depurar os valores enviados
    
    try {
      const isAdmin = await this.authService.login(this.f['email'].value, this.f['password'].value);
      console.log('[LoginComponent] isAdmin retornado:', isAdmin);
      
      if (isAdmin) {
        console.log('Redirecionando para /admin');
        this.router.navigate(['/admin']);
      } else {
        console.log('Redirecionando para /index/games');
        this.router.navigateByUrl('/index/games');
      }
    } catch (error) {
    console.error('Erro no login', error);
    }
  }
}

