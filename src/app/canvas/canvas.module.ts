import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { environment } from 'src/environments/environment'
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { CanvasComponent } from './canvas.component';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  CanvasRoutingModule
} from './canvas-routing.module'
import {AngularFireStorageModule} from '@angular/fire/compat/storage'
// import { LoginComponent } from './auth/login/login.component';
@NgModule({
  declarations: [
    // AppComponent,
    // CanvasComponent,
    // LoginComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    CanvasRoutingModule
  ],
  providers: [],
  bootstrap: [CanvasComponent]
})
export class CanvasModule { }
