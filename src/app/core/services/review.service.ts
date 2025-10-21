import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, collectionData } from '@angular/fire/firestore';
import { Review } from '../models/review.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private firestore: Firestore) {}

  addReview(review: Omit<Review, 'id'>): Promise<void> {
    const reviewsRef = collection(this.firestore, 'reviews');
    return addDoc(reviewsRef, {
      ...review,
      createdAt: new Date()
    }).then();
  }

  getGameReviews(gameId: string): Observable<Review[]> {
    const reviewsRef = collection(this.firestore, 'reviews');
    const reviewQuery = query(reviewsRef, where('gameId', '==', gameId));

    return collectionData(reviewQuery, { idField: 'id' }).pipe(
      map(reviews => reviews as Review[])
    );
  }

  calculateAverageRating(reviews: Review[]): number {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }
}
