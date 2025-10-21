import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { Observable } from 'rxjs';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { Language } from '../../core/models/language.model'

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language.component.html',
  styleUrl: './language.component.scss'
})
export class LanguageComponent implements OnInit {
  languageService = inject(LanguageService);
  languages$!: Observable<Language[]>;

  constructor(private accessibilityService: AccessibilityService) {}

  ngOnInit() {
    this.loadLanguages();
  }

  onButtonClick(text: string) {
    this.accessibilityService.speak(text);
  }

  loadLanguages() {
    this.languages$ = this.languageService.getLanguages();
  }
}
