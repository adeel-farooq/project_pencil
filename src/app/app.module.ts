import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {AdminLayoutRoutes} from './app.routing'
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    // LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forChild(AdminLayoutRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
