import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RecaptchaService } from '../../auth/services/recaptcha.service';

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const errors: any = {};
  if (value.length < 8) errors.minlength = true;
  if (!/[A-Z]/.test(value)) errors.uppercase = true;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.symbol = true;

  return Object.keys(errors).length ? errors : null;
}

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
    private router: Router,
    private recaptcha: RecaptchaService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)]],
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  get f() { return this.registerForm.controls; }

  get passwordErrors(): string[] {
    const errors = this.registerForm.get('password')?.errors;
    if (!errors) return [];
    const messages: string[] = [];
    if (errors['minlength']) messages.push('A senha deve ter pelo menos 8 caracteres.');
    if (errors['uppercase']) messages.push('A senha deve conter pelo menos uma letra maiúscula.');
    if (errors['symbol']) messages.push('A senha deve conter pelo menos um símbolo (ex: *, @, #).');
    return messages;
  }

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
    if (this.registerForm.invalid) {
      console.log('Formulário inválido');
      return;
    }

    try {
      const response = (window as any).grecaptcha.getResponse();
      if (!response) {
        alert("Confirme o reCAPTCHA");
        return;
      }
      
      await this.authService.register(
        this.f['email'].value,
        this.f['password'].value,
        this.f['name'].value
      );

    this.router.navigate(['/home']);
  } catch (err) {
    console.error('Erro no registro', err);
  }
}
}
