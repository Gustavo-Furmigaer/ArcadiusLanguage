import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

userLoggedIn = false;

constructor(private afAuth: AngularFireAuth) {
  this.afAuth.authState.subscribe(user => {
    this.userLoggedIn = !!user;
  });
}

}
