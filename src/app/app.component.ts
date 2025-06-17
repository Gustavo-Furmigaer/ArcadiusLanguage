import { MockDataInsertion } from './core/services/mock-data.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { SpeechToggleComponent } from './features/speech-toggle/speech-toggle.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, HeaderComponent, SpeechToggleComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  mock = inject(MockDataInsertion)
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    //this.mock.insertMockData();
  }
}
