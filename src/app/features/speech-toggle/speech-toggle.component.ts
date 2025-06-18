import { Component, OnInit } from '@angular/core';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-speech-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './speech-toggle.component.html',
  styleUrls: ['./speech-toggle.component.scss']
})
export class SpeechToggleComponent implements OnInit {
  isSpeechEnabled: boolean = true;
  allVoices: SpeechSynthesisVoice[] = [];
  selectedVoiceName: string | null = null;
  rate: number = 1.3;
  pitch: number = 1.2;
  showVoiceControls: boolean = false;
  private hideTimeout: any;

  constructor(private accessibilityService: AccessibilityService) {}

  ngOnInit() {
    const stored = localStorage.getItem('speechEnabled');
    this.isSpeechEnabled = stored !== null ? JSON.parse(stored) : true;

    const loadVoices = () => {
      this.allVoices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('pt'));
      if (!this.selectedVoiceName && this.allVoices.length) {
        const maria = this.allVoices.find(v => v.name.toLowerCase().includes('maria'));
        this.selectedVoiceName = maria ? maria.name : this.allVoices[0].name;
      }
    };

    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }

  toggleSpeech() {
    this.isSpeechEnabled = !this.isSpeechEnabled;
    localStorage.setItem('speechEnabled', JSON.stringify(this.isSpeechEnabled));
    this.accessibilityService.toggleSpeech(this.isSpeechEnabled);
  }

  announceHover() {
    if (!this.isSpeechEnabled) return;
    const description = this.isSpeechEnabled
      ? 'Clique para desativar a descrição falada'
      : 'Clique para ativar a descrição falada';
    this.speak(description);
  }

  stopHover() {
    speechSynthesis.cancel();
  }

  updateVoices() {
    localStorage.setItem('selectedVoice', this.selectedVoiceName!);
  }

  private speak(text: string) {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.rate = this.rate;
    utter.pitch = this.pitch;
    const voice = this.allVoices.find(v => v.name === this.selectedVoiceName);
    utter.voice = voice || null;
    speechSynthesis.speak(utter);
  }

  showControls() {
    clearTimeout(this.hideTimeout);
    this.showVoiceControls = true;
  }

  hideControlsWithDelay() {
    this.hideTimeout = setTimeout(() => {
      this.showVoiceControls = false;
    }, 2000); // 2 segundos
  }
}
