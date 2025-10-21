import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Observable } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private path = 'games'; // Nome da coleção no Firestore

  constructor(private firestoreService: FirestoreService) {}

  getGames(): Observable<Game[]> {
    return this.firestoreService.getCollection<Game>(this.path);
  }

  getGame(id: string): Observable<Game> {
    return this.firestoreService.getDocument<Game>(this.path, id);
  }

  createGame(game: Game): Observable<void> {
    const id = this.firestoreService.generateId(this.path);
    return new Observable<void>((observer) => {
      id.subscribe((generatedId) => {
        this.firestoreService.createDocument<Game>(this.path, generatedId, { ...game, id: generatedId })
          .subscribe({
            next: () => {
              observer.next();
              observer.complete();
            },
            error: (error) => observer.error(error)
          });
      });
    });
  }

  updateGame(id: string, game: Partial<Game>): Observable<void> {
    return this.firestoreService.updateDocument<Game>(this.path, id, game);
  }

  deleteGame(id: string): Observable<void> {
    return this.firestoreService.deleteDocument(this.path, id);
  }
}
