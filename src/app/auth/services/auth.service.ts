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
  public isAdmin$ = new BehaviorSubject<boolean>(false); // valor inicial padrão

  private userPhotoUrlSubject = new BehaviorSubject<string>('assets/iconeLogado.jpg');
  userPhotoUrl$ = this.userPhotoUrlSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string>('Usuário');
  userName$ = this.userNameSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: Firestore,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.listenToAuthChanges();
  }

  private listenToAuthChanges() {
    this.afAuth.onAuthStateChanged(async (user) => {
      this.userSubject.next(user);

      if (user) {
        const userDocRef = doc(this.firestore, 'usuarios', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userSnap = docSnap.data();
          const nome = (userSnap as any)?.nome || 'Usuário';
          const fotoUrl = (userSnap as any)?.fotoUrl || 'assets/iconeLogado.jpg';
          const isAdmin = (userSnap as any)?.isAdmin === true || (userSnap as any)?.admin === true;

          this.userNameSubject.next(nome);
          this.userPhotoUrlSubject.next(fotoUrl);
          this.isAdmin$.next(isAdmin);
          console.log('[AuthService] Estado restaurado: isAdmin =', isAdmin);

          
        } else {
          this.isAdmin$.next(false);
          this.userNameSubject.next('Usuário');
          this.userPhotoUrlSubject.next('assets/iconeLogado.jpg');
        }
      }
    });
  }

  updatePhotoUrl(url: string) {
    this.userPhotoUrlSubject.next(url);
  }

  updateUserName(name: string) {
    this.userNameSubject.next(name);
  }

  async reloadUserData() {
  const user = await this.afAuth.currentUser;
  if (!user) return;

  const userDocRef = doc(this.firestore, 'usuarios', user.uid);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    const userSnap = docSnap.data();
    const nome = (userSnap as any)?.nome || 'Usuário';
    const fotoUrl = (userSnap as any)?.fotoUrl || 'assets/iconeLogado.jpg';

    this.userNameSubject.next(nome);
    this.userPhotoUrlSubject.next(fotoUrl);
  }
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

    let attempts = Number(localStorage.getItem('loginAttempts') || 0);
    const lastAttempt = Number(localStorage.getItem('lastAttempt') || 0);
    const elapsed = Date.now() - lastAttempt;

    // Reset após 5 minutos
    if (elapsed > 5 * 60 * 1000) {
      localStorage.setItem('loginAttempts', '0');
      attempts = 0;
    }

    if (attempts >= 5 && elapsed < 5 * 60 * 1000) {
      console.warn('[AuthService] Muitas tentativas. Aguarde 5 minutos.');
      throw new Error('Muitas tentativas. Tente novamente em alguns minutos.');
    }
    // --- fim do controle ---
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lastAttempt');
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
      let attempts = Number(localStorage.getItem('loginAttempts') || 0);
      localStorage.setItem('loginAttempts', (attempts + 1).toString());
      localStorage.setItem('lastAttempt', Date.now().toString());
      throw error;
    }
  }
}

