import { Observable } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { GameService } from '../../core/services/game.service';
import { CommonModule } from '@angular/common';
import { Game } from '../../core/models/game.model';

@Component({
  selector: 'app-Games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss'
})
export class GamesComponent implements OnInit {
  gameService = inject(GameService)
  games$!: Observable<Game[]>;

  constructor(private accessibilityService: AccessibilityService) {}

  ngOnInit(): void {
    this.loadGames();
  }

  onButtonClick(text: string) {
    this.accessibilityService.speak(text);
  }

  loadGames() {
    this.games$ = this.gameService.getGames()
  }
}
