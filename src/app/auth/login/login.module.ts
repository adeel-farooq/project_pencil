import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
@NgModule({
  declarations: [
    // LoginComponent,

  ],
  imports: [
    CommonModule,

    LoginRoutingModule,
    FormsModule,

    ReactiveFormsModule,
    HttpClientModule,

  ],
  providers: [],
  // bootstrap: [LoginComponent]
})
export class LoginModule { }
