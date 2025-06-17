import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from '../../core/services/firestore.service';
import { Router } from '@angular/router';
import { Firestore, doc, docData, getDoc } from '@angular/fire/firestore';
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
    private firestore: Firestore,
    private firestoreService: FirestoreService,
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
        await lastValueFrom(this.firestoreService.createDocument('usuarios', uid, {
          email,
          nome: name,
          criadoEm: new Date(),
          admin: false
        }));
        await this.router.navigate(['/jogos']);
      }

      this.router.navigate(['/jogos']);
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    console.log('[AuthService] Iniciando login...');
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('[AuthService] Login Firebase OK');
      const user = userCredential.user;
      if (!user) throw new Error('Usuário não encontrado');

      console.log('[AuthService] Buscando documento do Firestore para UID:', user.uid);

      const userDocRef = doc(this.firestore, 'usuarios', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        throw new Error('[AuthService] Documento do usuário não existe!');
      }

      const userSnap = docSnap.data();
      console.log('[AuthService] Documento Firestore carregado:', userSnap);

      const isAdmin = (userSnap as any)?.isAdmin === true || (userSnap as any)?.admin === true;
      this.isAdmin$.next(isAdmin);
      this.userSubject.next(user);
      console.log('[AuthService] isAdmin:', isAdmin);

      return isAdmin;
    } catch (error) {
      console.error('[AuthService] Erro no login:', error);
      throw error;
    }
  }
}
