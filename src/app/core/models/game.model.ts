import { Language } from "./language.model";

export interface Game {
  id: string;
  img: string;
  alt: string;
  name: string;
  genre: string;
  description: string;
  language: Language;
}

