import { Component, EventEmitter, input, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen()" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Avaliar {{ modalGameName() }}</h2>
          <button class="close-button" (click)="close()">×</button>
        </div>

        <form [formGroup]="reviewForm()" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <div class="rating-container">
              <label>Sua avaliação:</label>
              <div class="stars">
                <span *ngFor="let star of [1,2,3,4,5]"
                      (click)="setRating(star)"
                      [class.active]="star <= reviewForm().get('rating')?.value">
                  ⭐
                </span>
              </div>
              <small class="error" *ngIf="reviewForm().get('rating')?.errors?.['required'] && reviewForm().get('rating')?.touched">
                A avaliação é obrigatória
              </small>
              <small class="error" *ngIf="reviewForm().get('rating')?.errors?.['min'] && reviewForm().get('rating')?.touched">
                A avaliação mínima é 1 estrela
              </small>
              <small class="error" *ngIf="reviewForm().get('rating')?.errors?.['max'] && reviewForm().get('rating')?.touched">
                A avaliação máxima é 5 estrelas
              </small>
            </div>

            <textarea
              formControlName="comment"
              placeholder="Compartilhe sua experiência..."
              rows="4">
            </textarea>
            <small class="error" *ngIf="reviewForm().get('comment')?.errors?.['required'] && reviewForm().get('comment')?.touched">
              O comentário é obrigatório
            </small>
            <small class="error" *ngIf="reviewForm().get('comment')?.errors?.['minlength'] && reviewForm().get('comment')?.touched">
              O comentário deve ter pelo menos 10 caracteres
            </small>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" (click)="close()">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="reviewForm().invalid">
              Enviar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: #1e1e1e;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      color: #ffffff;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .close-button {
      background: none;
      border: none;
      color: #ffffff;
      font-size: 24px;
      cursor: pointer;
    }

    .rating-container {
      margin-bottom: 20px;
    }

    .stars {
      display: flex;
      gap: 5px;
      cursor: pointer;
      margin-top: 10px;
    }

    .stars span {
      opacity: 0.5;
      transition: 0.3s;
    }

    .stars span.active {
      opacity: 1;
    }

    .form-field {
      margin-bottom: 20px;
    }

    textarea {
      width: 100%;
      padding: 10px;
      background: #2a2a2a;
      border: 1px solid #404040;
      color: #ffffff;
      border-radius: 4px;
    }

    .error {
      color: #ff4444;
      font-size: 12px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .btn-primary, .btn-secondary {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: #1db954;
      color: #ffffff;
    }

    .btn-secondary {
      background: #404040;
      color: #ffffff;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ReviewModalComponent {
  isOpen = signal(false);
  modalGameName = input.required<string>();
  modalGameId = input.required<string>();
  @Output() closeModal = new EventEmitter<void>();

  rating = signal(0);
  reviewForm = signal<FormGroup>(this.fb.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  }));

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  setRating(value: number): void {
    this.rating.set(value);
    this.reviewForm().patchValue({ rating: value });
  }

  close(): void {
    this.isOpen.set(false);
  }

  onSubmit(): void {
    if (this.reviewForm().valid) {
      const user = this.authService.getCurrentUser();

      if (!user) {
        console.error('Usuário não está logado');
        return;
      }

      const review = {
        userId: user.uid,
        userName: user.email || 'Anônimo',
        gameId: this.modalGameId(),
        rating: this.reviewForm().value.rating,
        comment: this.reviewForm().value.comment,
        createdAt: new Date()
      };

      this.reviewService.addReview(review)
        .then(() => {
          this.close();
          this.reviewForm().reset();
          this.rating.set(0);
        })
        .catch(error => console.error('Erro ao salvar review:', error));
    }
  }

  toggle(): void {
    this.isOpen.update(currentValue => !currentValue);
  }
}
