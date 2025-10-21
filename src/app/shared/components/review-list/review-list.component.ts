import { Component, input, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';
import { Observable } from 'rxjs';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, TimestampToDatePipe],
  template: `
    <div class="reviews-container">
      <div class="reviews-summary" *ngIf="reviews$ | async as reviews">
        <h3>Avaliações dos Usuários</h3>
        <div class="average-rating">
          <span class="rating">{{ calculateAverageRating(reviews) | number:'1.1-1' }}</span>
          <span class="total">de 5 ({{ reviews.length }} avaliações)</span>
        </div>
      </div>

      <div class="reviews-list">
        <div class="review-item" *ngFor="let review of reviews$ | async">
          <div class="review-header">
            <div class="user-name">{{ review.userName }}</div>
            <div class="stars">
              <span *ngFor="let star of [1,2,3,4,5]"
                    [class.active]="star <= review.rating">⭐</span>
            </div>
            <span class="review-date">{{ review.createdAt | timestampToDate | date:'dd/MM/yyyy' }}</span>
          </div>
          <p class="comment">{{ review.comment }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-container {
      padding: 20px;
    }
    .reviews-summary {
      margin-bottom: 20px;
    }
    .average-rating {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .rating {
      font-size: 24px;
      font-weight: bold;
    }
    .total {
      font-size: 16px;
      color: #666;
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .review-item {
      padding: 15px;
      background: #1e1e1e;
      border-radius: 8px;
    }
    .review-header {
      display: flex;
      gap: 15px;
      margin-bottom: 10px;
      flex-direction: column;
    }
    .user-name {
      font-weight: bold;
      color: #ffffff;
    }
    .stars {
      display: flex;
      gap: 5px;
    }
    .stars span {
      opacity: 0.5;
    }
    .stars span.active {
      opacity: 1;
    }
    .review-date {
      color: #666;
      font-size: 14px;
    }
    .comment {
      color: #ffffff;
      margin: 0;
      line-height: 1.4;
    }
  `]
})
export class ReviewListComponent implements OnInit {
  gameId = input.required<string>();
  reviews$!: Observable<Review[]>;

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    this.reviews$ = this.reviewService.getGameReviews(this.gameId());
  }

  calculateAverageRating(reviews: Review[]): number {
    return this.reviewService.calculateAverageRating(reviews);
  }
}
