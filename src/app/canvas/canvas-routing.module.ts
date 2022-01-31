import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './auth/login/login.component';
import { CanvasComponent } from './canvas.component';
const routes: Routes = [
 {
    path: 'canvas',
    component: CanvasComponent,
    // data: {returnUrl: window.location.pathname}
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanvasRoutingModule { }
