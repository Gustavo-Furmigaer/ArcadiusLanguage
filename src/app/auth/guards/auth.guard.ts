import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.afAuth.authState.pipe(
      take(1), // Obtém o state de autenticação uma única vez
      map(user => {
        if (user) {
          return true; // Permite acesso se o usuário estiver autenticado
        } else {
          this.router.navigate(['/login']); // Redireciona para a página de login se não estiver autenticado
          return false;
        }
      })
    );
  }
}
