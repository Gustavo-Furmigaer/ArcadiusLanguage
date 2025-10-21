import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private isSpeechEnabled: boolean = true;

  speak(text: string) {
    if (this.isSpeechEnabled) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'pt-BR';
      window.speechSynthesis.speak(speech);
    }
  }

  toggleSpeech(enabled: boolean) {
    this.isSpeechEnabled = enabled;
  }
}
