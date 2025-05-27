import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from '../../core/services/firestore.service'; // ajuste o path
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
   isAdmin$ = new BehaviorSubject<boolean>(false); // valor inicial padrão
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private router: Router
  ) {}

  async register(email: string, password: string, name:string): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      if (uid) {
        // Salva dados adicionais no Firestore
        await this.firestore.createDocument('usuarios', uid, {
          email,
          criadoEm: new Date(),
        }).toPromise(); // converte Observable para Promise
      }
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

    // (opcional) Redirecionamento aqui se preferir centralizar

    // Se você quiser manter isAdmin$, precisará implementá-lo aqui
    // this.isAdmin$.next(true ou false);
  } catch (error) {
    throw error;
  }
}

}
