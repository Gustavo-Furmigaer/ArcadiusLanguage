import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../core/services/game.service';
import { Observable, map } from 'rxjs';
import { Game } from '../../core/models/game.model';
import { ReviewListComponent } from "../../shared/components/review-list/review-list.component";
import { ReviewModalComponent } from "../../shared/components/review-modal/review-modal.component";

interface PromoGame extends Game {
  discountedPrice: number;
}

@Component({
  selector: 'app-promo',
  standalone: true,
  imports: [CommonModule, ReviewListComponent, ReviewModalComponent],
  templateUrl: './promo.component.html',
  styleUrl: './promo.component.scss'
})
export class PromoComponent implements OnInit {
  featuredPromo$!: Observable<PromoGame>;
  otherPromos$!: Observable<PromoGame[]>;
  private currentOpenModalId = signal<string | null>(null);

  constructor(
    private gameService: GameService
  ) {}

  ngOnInit() {
    const games$ = this.gameService.getGames();

    this.featuredPromo$ = games$.pipe(
      map(games => this.createPromoGame(games[0]))
    );

    this.otherPromos$ = games$.pipe(
      map(games => games.slice(1, 5).map(game => this.createPromoGame(game)))
    );
  }

  private createPromoGame(game: Game): PromoGame {
    return {
      ...game,
      discountedPrice: this.calculateDiscountedPrice(game)
    };
  }

  private calculateDiscountedPrice(game: Game): number {
    // Simples cálculo de desconto (20% off)
    const originalPrice = 100; // Preço base fictício
    return originalPrice * 0.8;
  }

  isModalOpen = (gameId: string) => this.currentOpenModalId() === gameId;

  openReviewModal(gameId: string): void {
    this.currentOpenModalId.set(gameId);
  }

  closeReviewModal(): void {
    this.currentOpenModalId.set(null);
  }
}
