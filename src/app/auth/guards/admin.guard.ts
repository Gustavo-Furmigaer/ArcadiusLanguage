import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAdmin$.pipe(
      take(1),
      map(isAdmin => {
        if (isAdmin) {
          return true;
        } else {
          this.router.navigate(['/index/games']);
          return false;
        }
      })
    );
  }
}
