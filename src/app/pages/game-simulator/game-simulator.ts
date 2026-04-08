import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../core/services/stats';
import { LeaderboardService } from '../../core/services/leaderboard.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-simulator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-simulator.html',
  styleUrls: ['./game-simulator.scss']
})
export class GameSimulatorComponent implements OnInit {

  userId = 'user_123';
  userName = 'Teste User';

  stats: any;
  ranking: any[] = [];

  constructor(
    private statsService: StatsService,
    private leaderboardService: LeaderboardService
  ) {}

  async ngOnInit() {
    await this.carregarStats();
    await this.carregarRanking();
  }

  async simularJogo() {
    const acertos = Math.floor(Math.random() * 10);
    const erros = Math.floor(Math.random() * 5);
    const pontuacao = acertos * 10;

    await this.statsService.updateStats(this.userId, acertos, erros);

    await this.leaderboardService.updateScore(
      this.userId,
      this.userName,
      pontuacao
    );

    await this.carregarStats();
    await this.carregarRanking();
  }

  async carregarStats() {
    this.stats = await this.statsService.getStats(this.userId);
  }

  async carregarRanking() {
    this.ranking = await this.leaderboardService.getTop10();
  }
}