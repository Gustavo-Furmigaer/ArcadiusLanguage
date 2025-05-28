import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from '../../core/services/firestore.service'; // ajuste o path
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { User } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  public isLoggedIn$ = this.user$.pipe(map(user => !!user));
  isAdmin$ = new BehaviorSubject<boolean>(false); // valor inicial padrão
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private router: Router
  ) {}

  async logout(): Promise<void> {
      await this.afAuth.signOut();
      this.userSubject.next(null);
      this.router.navigate(['/']);
    }

    getCurrentUser(): User | null {
      return this.userSubject.value;
    }

  async register(email: string, password: string, name:string): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      if (uid) {
        // Salva dados adicionais no Firestore
        await this.firestore.createDocument('usuarios', uid, {
          email,
          nome: name,
          criadoEm: new Date(),
        }).toPromise(); // converte Observable para Promise
      }

      this.router.navigate(['/jogos']); // redireciona após registrar
    } catch (error) {
      throw error;
    }
  }
  async login(email: string, password: string, name:string): Promise<void> {
  try {
    const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    this.router.navigate(['/jogos']); // redireciona após login
    // Se você quiser manter isAdmin$, precisará implementá-lo aqui
    // this.isAdmin$.next(true ou false);
  } catch (error) {
    throw error;
  }
}

}
