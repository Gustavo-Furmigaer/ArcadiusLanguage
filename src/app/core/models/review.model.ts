export interface Review {
  id?: string;
  userId: string;
  gameId: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: Date;
}
