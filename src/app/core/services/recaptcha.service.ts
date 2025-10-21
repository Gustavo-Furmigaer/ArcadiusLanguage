import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  private siteKey = '6LfZpcwrAAAAAOWt1IT16lUg4HlsLzozcPHRD7Qz'; // substitua pela chave v3

  execute(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!(window as any).grecaptcha) {
        reject('reCAPTCHA não carregado');
        return;
      }

      (window as any).grecaptcha.ready(() => {
        (window as any).grecaptcha.execute(this.siteKey, { action })
          .then((token: string) => resolve(token))
          .catch(reject);
      });
    });
  }
}
