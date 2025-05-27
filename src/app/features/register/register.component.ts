import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  get f() { return this.registerForm.controls; }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  async onSubmit() {
    console.log('Formulário enviado:');
    const { name, email, password } = this.registerForm.value;
    await this.authService.register(email, password, name);
    if (this.registerForm.invalid) {
      console.log('Formulário inválido');
      return;
    }
    
    this.authService.register(
      this.f['name'].value,
      this.f['email'].value,
      this.f['password'].value,
    )
      .then(() => {
        console.log('Registro bem-sucedido');
        this.router.navigate(['/home']);
      })
      .catch(error => console.error('Erro no registro', error));
  }
}

