import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from '../../core/services/firestore.service'; // ajuste o path
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private router: Router
  ) {}

  async register(email: string, password: string): Promise<void> {
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
}
