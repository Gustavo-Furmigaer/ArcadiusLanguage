import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  userLoggedIn = false;
  userEmail: string | null = null;
  userPhotoUrl: string = 'assets/iconelogado2.jpg';
  initialized = false;
  isAdmin$: Observable<boolean>;

  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private router: Router) {
  console.log('NavbarComponent inicializado');

  this.isAdmin$ = this.authService.isAdmin$;

  this.afAuth.authState.subscribe(user => {
    console.log('User:', user);

    this.userLoggedIn = !!user;
    this.userEmail = user ? user.email : null;

    const rawPhoto = user?.photoURL ?? '';
    const isSvg = rawPhoto.startsWith('data:image/svg+xml') || rawPhoto.endsWith('.svg');
    const isGoogleDefault = rawPhoto.includes('googleusercontent.com') && rawPhoto.includes('default');

    this.userPhotoUrl = (!rawPhoto || isSvg || isGoogleDefault)
      ? 'assets/iconelogado2.jpg'
      : rawPhoto;

    console.log('Final userPhotoUrl:', this.userPhotoUrl);

    this.initialized = true;
  });
}

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
