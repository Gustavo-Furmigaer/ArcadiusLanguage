import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, limit } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private firestore: Firestore) {}

  async updateScore(userId: string, name: string, score: number) {
    const ref = doc(this.firestore, `leaderboard/${userId}`);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      const data: any = snapshot.data();

      // Só atualiza se a pontuação for maior
      if (score > data.score) {
        await updateDoc(ref, {
          score: score,
          updatedAt: new Date()
        });
      }
    } else {
      await setDoc(ref, {
        name,
        score,
        updatedAt: new Date()
      });
    }
  }

  async getTop10() {
    const ref = collection(this.firestore, 'leaderboard');
    const q = query(ref, orderBy('score', 'desc'), limit(10));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  }
}