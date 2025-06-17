import { Component, OnInit } from '@angular/core';
import { GameService } from '../../core/services/game.service';
import { LanguageService } from '../../core/services/language.service';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Game } from '../../core/models/game.model';
import { Language } from '../../core/models/language.model';

@Component({
  selector: 'app-game-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './game-management.component.html',
  styleUrls: ['./game-management.component.scss']
})
export class GameManagementComponent implements OnInit {
  games$!: Observable<Game[]>;
  languages$!: Observable<Language[]>;
  gameForm: FormGroup;
  editMode = false;
  currentGameId: string | null = null;

  constructor(
    private gameService: GameService,
    private languageService: LanguageService,
    private fb: FormBuilder
  ) {
    this.gameForm = this.fb.group({
      name: ['', Validators.required],
      genre: ['', Validators.required],
      img: ['', Validators.required],
      alt: ['', Validators.required],
      description: ['', Validators.required],
      languageId: ['']
    });
  }

  ngOnInit(): void {
    this.loadGames();
    this.loadLanguages();
  }

  loadGames(): void {
    this.games$ = this.gameService.getGames();
  }

  loadLanguages(): void {
    this.languages$ = this.languageService.getLanguages();
  }

  addGame(): void {
    if (this.gameForm.valid) {
      const newGame: Game = this.gameForm.value;
      this.gameService.createGame(newGame).subscribe(() => {
        this.loadGames();
        this.gameForm.reset();
      });
    }
  }

  updateGame(): void {
    if (this.gameForm.valid && this.currentGameId) {
      const updatedGame: Partial<Game> = this.gameForm.value;
      this.gameService.updateGame(this.currentGameId, updatedGame).subscribe(() => {
        this.loadGames();
        this.resetForm();
      });
    }
  }

  deleteGame(id: string): void {
    this.gameService.deleteGame(id).subscribe(() => {
      this.loadGames();
    });
  }

  editGame(game: Game): void {
    console.log(game);
    this.editMode = true;
    this.currentGameId = game.id;
    this.gameForm.patchValue({
      name: game.name,
      genre: game.genre,
      img: game.img,
      alt: game.alt,
      description: game.description,
      languageId: game.language || ''
  });
}

  resetForm(): void {
    this.editMode = false;
    this.currentGameId = null;
    this.gameForm.reset();
  }

  onSubmit(): void {
    if (this.editMode) {
      this.updateGame();
    } else {
      this.addGame();
    }
  }
}
