import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import {CanvasComponent} from './canvas/canvas.component'
import { AppComponent } from './app.component';
 const routes: Routes = [
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

//   {
//    path: '',
//    component: CanvasComponent,
//    children: [
//        {
//      path: 'canvas',
//      loadChildren: () => import('../app/canvas/canvas.module').then(m => m.CanvasModule)
//  }]},

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponent=[LoginComponent,CanvasComponent]
