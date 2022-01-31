import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(private auth:AuthService,  private router: Router) { }

  ngOnInit() {
console.log('ssssssssss');

    if (localStorage.getItem('googleId')) {
      console.log('hereeeeeeeeee');
this.router.navigateByUrl('/canvas')
    }
  }
  login(){
    const val=this.auth.googleLogin()
this.ngOnInit()
      }

}
