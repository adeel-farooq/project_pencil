import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth:AuthService,  private router: Router) { }

  ngOnInit() {

    if (localStorage.getItem('googleId')) {
      console.log('here');
this.router.navigateByUrl('/canvas')
    }
  }
  login(){
    const val=this.auth.googleLogin()
this.ngOnInit()
      }
}
