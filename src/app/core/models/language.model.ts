import { Game } from "./game.model";

export interface Language {
  id?: string;
  name: string;
  flag: string;
  culturalCuriosities: string[];
  games: Game[];
}
