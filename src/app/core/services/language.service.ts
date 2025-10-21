import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Observable } from 'rxjs';
import { Language } from '../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private path = 'languages'; // Nome da coleção no Firestore

  constructor(private firestoreService: FirestoreService) {}

  getLanguages(): Observable<Language[]> {
    return this.firestoreService.getCollection<Language>(this.path);
  }

  getLanguage(id: string): Observable<Language> {
    return this.firestoreService.getDocument<Language>(this.path, id);
  }

  createLanguage(language: Language): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestoreService.generateId(this.path).subscribe((id) => {
        this.firestoreService.createDocument<Language>(this.path, id, { ...language, id }).subscribe({
          next: () => {
            observer.next(); // Notifica que a operação foi concluída
            observer.complete(); // Completa o Observable
          },
          error: (error) => observer.error(error) // Notifica erro, se ocorrer
        });
      });
    });
  }

  updateLanguage(id: string, language: Partial<Language>): Observable<void> {
    return this.firestoreService.updateDocument<Language>(this.path, id, language);
  }

  deleteLanguage(id: string): Observable<void> {
    return this.firestoreService.deleteDocument(this.path, id);
  }
}
