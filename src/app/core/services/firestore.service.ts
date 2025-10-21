import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, doc, docData, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

  constructor() {}

  getCollection<T>(path: string): Observable<T[]> {
    return collectionData(collection(this.firestore, path), {
      idField: 'id',
    }) as Observable<T[]>;
  }

  getDocument<T>(path: string, id: string): Observable<T> {
    return docData(doc(this.firestore, path, id), { idField: 'id' }) as Observable<T>;
  }

  createDocument<T>(
    path: string,
    id: string,
    data: any
  ): Observable<void> { // Alterado para retornar um Observable
    const docRef = doc(this.firestore, path, id);
    return new Observable<void>((observer) => {
      setDoc(docRef, { ...data }).then(() => {
        observer.next(); // Notifica que a operação foi concluída
        observer.complete(); // Completa o Observable
      }).catch((error) => observer.error(error)); // Notifica erro, se ocorrer
    });
  }

  generateId(path: string, id?: string): Observable<string> {
    const taskCollection = collection(this.firestore, path);
    const docRef = id ? doc(taskCollection, id) : doc(taskCollection);
    return new Observable<string>((observer) => {
      observer.next(docRef.id);
      observer.complete();
    });
  }

  updateDocument<T>(path: string, id: string, data: Partial<T>): Observable<void> {
    const docRef = doc(this.firestore, path, id);
    return new Observable<void>((observer) => {
      setDoc(docRef, data, { merge: true }).then(() => {
        observer.next();
        observer.complete();
      }).catch((error) => observer.error(error));
    });
  }

  deleteDocument(path: string, id: string): Observable<void> {
    const docRef = doc(this.firestore, path, id);
    return new Observable<void>((observer) => {
      deleteDoc(docRef).then(() => {
        observer.next();
        observer.complete();
      }).catch((error) => observer.error(error));
    });
  }
}
