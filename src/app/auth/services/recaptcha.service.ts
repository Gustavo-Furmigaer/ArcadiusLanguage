import { Injectable } from '@angular/core';

declare const grecaptcha: any;

@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  private siteKey = '6LfZpcwrAAAAAOWt1IT16lUg4HlsLzozcPHRD7Qz';
  async execute(action: string): Promise<string> {
    if (typeof grecaptcha === 'undefined') {
      return Promise.reject('reCAPTCHA não carregado');
    }

    return new Promise((resolve, reject) => {
      try {
        grecaptcha.ready(() => {
          grecaptcha.execute(this.siteKey, { action })
            .then((token: string) => resolve(token))
            .catch((err: any) => reject(err));
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

