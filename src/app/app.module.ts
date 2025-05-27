import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    //AppComponent,
    //LoginComponent,
    //RegisterComponent,
    // ... outros componentes
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],

  
  providers: [],
  // bootstrap: [AppComponent]
})
export class AppModule {}
