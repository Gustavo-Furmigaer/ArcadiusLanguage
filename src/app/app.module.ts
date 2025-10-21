import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Componentes
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';

// Firebase + AngularFire
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    // LoginComponent,
    //RegisterComponent,
    // NavbarComponent,
    // ... outros componentes
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,

    RouterModule.forRoot(routes),

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppComponent
  ],

  providers: [],
  // bootstrap: [AppComponent]
})
export class AppModule {}
