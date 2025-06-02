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
    this.afAuth.authState.subscribe(user => {
      this.userLoggedIn = !!user;
      this.userEmail = user ? user.email : null;
      const rawPhoto = user?.photoURL ?? '';
      const isSvg = rawPhoto.startsWith('data:image/svg+xml') || rawPhoto.endsWith('.svg') || rawPhoto.includes('googleusercontent.com') && rawPhoto.includes('default');
      this.userPhotoUrl = 'assets/iconelogado.jpg';
      this.initialized = true;
    });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
