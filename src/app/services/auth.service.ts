import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model'; // optional
import { from, Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/auth'

@Injectable({ providedIn:   'root' })
export class AuthService {

  user!: User;

    constructor(
    private fireAuth:AngularFireAuth,
        private router: Router
    ) {
      this.fireAuth.authState.subscribe((user:any)=>{
this.user=user
      })
     }
  async  googleLogin(){
   await   this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((res:any)=>{
     console.log('login google',res.additionalUserInfo.profile.id);
     if(res.additionalUserInfo.profile.id){
      this.router.navigateByUrl('/canvas')
     }
localStorage.setItem('googleId',res.additionalUserInfo.profile.id)
   }).catch(err=>{
    console.error(err)
   })
    }

}
