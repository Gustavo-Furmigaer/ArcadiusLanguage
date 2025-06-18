import { Component } from '@angular/core';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-speech-toggle',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './speech-toggle.component.html',
  styleUrls: ['./speech-toggle.component.scss']
})
export class SpeechToggleComponent {
  isSpeechEnabled: boolean = true;

  constructor(private accessibilityService: AccessibilityService) {}

  toggleSpeech() {
    // 1️⃣ Inverte o estado
    this.isSpeechEnabled = !this.isSpeechEnabled;

    // 2️⃣ DEBUG: log no console + fala direta em pt-BR usando voz Microsoft (ou fallback)
    console.log('toggleSpeech chamado – isSpeechEnabled:', this.isSpeechEnabled);

    const text = this.isSpeechEnabled
      ? 'Descrição ativada'
      : 'Descrição desativada';

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';

    // 3️⃣ Seleciona a voz da Microsoft (Maria) ou fallback para qualquer pt-BR
    const voices = speechSynthesis.getVoices();
    const msVoice = voices.find(v =>
      v.lang === 'pt-BR' &&
      v.name.toLowerCase().includes('maria')
    );
    const fallbackVoice = voices.find(v => v.lang === 'pt-BR') || null;
    utter.voice = msVoice ?? fallbackVoice;

    // 4️⃣ Ajustes para fluidez
    utter.rate = 1.3;   // um pouco mais rápido
    utter.pitch = 1.2;  // tom mais natural

    // 5️⃣ Dispara a fala
    speechSynthesis.speak(utter);

    // 6️⃣ Chamada real ao seu serviço
    this.accessibilityService.toggleSpeech(this.isSpeechEnabled);
  }
}
