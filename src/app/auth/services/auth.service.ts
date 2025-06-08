import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from '../../core/services/firestore.service';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import firebase from 'firebase/compat/app';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<firebase.User | null>(null);
  public user$ = this.userSubject.asObservable();

  public isLoggedIn$ = this.user$.pipe(map(user => !!user));
  isAdmin$ = new BehaviorSubject<boolean>(false); // valor inicial padrão

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      this.userSubject.next(user);
    });
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  getCurrentUser(): firebase.User | null {
    return this.userSubject.value;
  }

  async register(email: string, password: string, name: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      if (uid) {
        await lastValueFrom(this.firestore.createDocument('usuarios', uid, {
          email,
          nome: name,
          criadoEm: new Date(),
        }));
        await this.router.navigate(['/jogos']);
      }

      this.router.navigate(['/jogos']);
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      this.router.navigate(['/jogos']);
      // Ex: this.isAdmin$.next(true ou false);
    } catch (error) {
      throw error;
    }
  }
}
