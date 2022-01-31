import { Routes, RouterModule  } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
export const AdminLayoutRoutes: Routes = [

    // {
    //   path: 'login',
    //   loadChildren: () => import('../app/login/login.module').then(m => m.LogModule)
    // },
    { path: 'login', component: LoginComponent},
];
/*
@NgModule({
  imports: [RouterModule.forRoot(AdminLayoutRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
*/
