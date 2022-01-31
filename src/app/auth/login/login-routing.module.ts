import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login.component';
import { CanvasComponent } from '../../canvas/canvas.component';
const routes: Routes = [
  // {
    // path: '',
    // component: LoginComponent,
    // children: [
      // {
      //   path: '',
      //   redirectTo: 'logins',
      //   pathMatch: 'full'
      // },
      {
        path: 'login',
        component: LoginComponent,
        data: {returnUrl: window.location.pathname}
      },
      {
        path: 'canvas',
        component: CanvasComponent,
        // data: {returnUrl: window.location.pathname}
      },
    //   {path: '', redirectTo: 'login', pathMatch: 'full'},
    //   {path: '**', redirectTo: 'login', pathMatch: 'full'},
    // ]
  // }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class LoginRoutingModule {}
