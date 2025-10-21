import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cookie-banner" *ngIf="!consentGiven">
      <p>
        Usamos cookies para melhorar sua experiência. Ao continuar, você concorda
        com nossa política de privacidade.
      </p>
      <button (click)="acceptCookies()">Aceitar</button>
    </div>
  `,
  styles: [`
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #222;
      color: white;
      padding: 1em;
      text-align: center;
      z-index: 9999;
    }

    .cookie-banner button {
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 6px 14px;
      margin-left: 10px;
      cursor: pointer;
    }

    .cookie-banner button:hover {
      background: #43a047;
    }
  `]
})
export class CookieConsentComponent {
  consentGiven = localStorage.getItem('cookieConsent') === 'true';

  acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    this.consentGiven = true;
  }
}
