import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgIf } from '@angular/common';


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
  userPhotoUrl: string = 'assets/iconelogado.jpg';
  initialized = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
  console.log('NavbarComponent inicializado');

  this.afAuth.authState.subscribe(user => {
    console.log('User:', user);

    this.userLoggedIn = !!user;
    this.userEmail = user ? user.email : null;

    const rawPhoto = user?.photoURL ?? '';
    const isSvg = rawPhoto.startsWith('data:image/svg+xml') || rawPhoto.endsWith('.svg');
    const isGoogleDefault = rawPhoto.includes('googleusercontent.com') && rawPhoto.includes('default');

    this.userPhotoUrl = (!rawPhoto || isSvg || isGoogleDefault)
      ? 'assets/iconelogado.jpg'
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
