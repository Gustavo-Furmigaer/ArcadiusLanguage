import { inject, Injectable } from '@angular/core';
import { Language } from '../models/language.model';
import { FirestoreService } from './firestore.service';
import { Game } from '../models/game.model';
import { forkJoin, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataInsertion {
  firestoreService = inject(FirestoreService)
  constructor() {}

  insertMockData() {
    const languages: Language[] = [
      {
        name: 'Inglês',
        flag: '🇺🇸',
        culturalCuriosities: [
          'O inglês é a língua mais falada no mundo dos negócios',
          'Hollywood é o centro da indústria cinematográfica global'
        ],
        games: []
      },
      {
        name: 'Japonês',
        flag: '🇯🇵',
        culturalCuriosities: [
          'O Japão é conhecido pela sua cultura de respeito e honra',
          'A culinária japonesa é considerada Patrimônio Cultural Imaterial pela UNESCO'
        ],
        games: []
      },
      {
        name: 'Polonês',
        flag: '🇵🇱',
        culturalCuriosities: [
          'A Polônia tem uma rica história de resistência e resiliência',
          'O pierogi é um dos pratos mais famosos da culinária polonesa'
        ],
        games: []
      }
    ];

    const games: Game[] = [
      {
        id: '',
        img: 'https://exemplo.com/gta5.jpg',
        alt: 'Imagem de Grand Theft Auto V',
        name: 'Grand Theft Auto V',
        genre: 'Ação-Aventura',
        description: 'Um jogo de mundo aberto ambientado na fictícia Los Santos',
        language: {} as Language
      },
      {
        id: '',
        img: 'https://exemplo.com/zelda.jpg',
        alt: 'Imagem de The Legend of Zelda: Breath of the Wild',
        name: 'The Legend of Zelda: Breath of the Wild',
        genre: 'Ação-Aventura',
        description: 'Uma aventura épica no vasto reino de Hyrule',
        language: {} as Language
      },
      {
        id: '',
        img: 'https://exemplo.com/witcher3.jpg',
        alt: 'Imagem de The Witcher 3: Wild Hunt',
        name: 'The Witcher 3: Wild Hunt',
        genre: 'RPG de Ação',
        description: 'Uma jornada épica em um mundo de fantasia sombria',
        language: {} as Language
      }
    ];

    // Inserir idiomas
    const languageInsertions = languages.map(language =>
      this.firestoreService.generateId('languages').pipe(
        switchMap(id => {
          language.id = id;
          return this.firestoreService.createDocument<Language>('languages', id, language);
        })
      )
    );

    forkJoin(languageInsertions).subscribe(
      () => {
        console.log('Idiomas inseridos com sucesso');

        // Após inserir os idiomas, inserir os jogos
        this.firestoreService.getCollection<Language>('languages').subscribe(
          insertedLanguages => {
            games[0].language = insertedLanguages.find(lang => lang.name === 'Inglês')!;
            games[1].language = insertedLanguages.find(lang => lang.name === 'Japonês')!;
            games[2].language = insertedLanguages.find(lang => lang.name === 'Polonês')!;

            const gameInsertions = games.map(game =>
              this.firestoreService.generateId('games').pipe(
                switchMap(id => {
                  game.id = id;
                  return this.firestoreService.createDocument<Game>('games', id, game);
                })
              )
            );

            forkJoin(gameInsertions).subscribe(
              () => console.log('Jogos inseridos com sucesso'),
              error => console.error('Erro ao inserir jogos:', error)
            );
          },
          error => console.error('Erro ao obter idiomas:', error)
        );
      },
      error => console.error('Erro ao inserir idiomas:', error)
    );
  }
}
