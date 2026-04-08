import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private firestore: Firestore) {}

  async updateStats(userId: string, correct: number, wrong: number) {
    const ref = doc(this.firestore, `stats/${userId}`);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      const data: any = snapshot.data();

      await updateDoc(ref, {
        totalGames: data.totalGames + 1,
        correctAnswers: data.correctAnswers + correct,
        wrongAnswers: data.wrongAnswers + wrong,
        lastPlayed: new Date()
      });
    } else {
      await setDoc(ref, {
        totalGames: 1,
        correctAnswers: correct,
        wrongAnswers: wrong,
        lastPlayed: new Date()
      });
    }
  }

  async getStats(userId: string) {
    const ref = doc(this.firestore, `stats/${userId}`);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? snapshot.data() : null;
  }
}