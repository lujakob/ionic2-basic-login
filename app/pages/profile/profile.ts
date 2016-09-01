import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {Storage, LocalStorage} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {FORM_DIRECTIVES} from '@angular/forms';
import {JwtHelper} from 'angular2-jwt';
import {AuthService} from '../../services/auth/auth';
import 'rxjs/add/operator/map'

@Component({
  templateUrl: 'build/pages/profile/profile.html',
  directives: [FORM_DIRECTIVES],
  providers: [AuthService]
})
export class ProfilePage {
  LOGIN_URL:string = "http://localhost:3333/authenticate";
  SIGNUP_URL:string = "http://localhost:3333/adduser";

  // When the page loads, we want the Login segment to be selected
  private authType:string = "login";
  // We need to set the content type for the server
  private contentHeader:Headers = new Headers({"Content-Type": "application/json"});
  private error:string;
  private jwtHelper:JwtHelper = new JwtHelper();
  private local:Storage = new Storage(LocalStorage);
  private userName:string;

  constructor(private http:Http, private auth:AuthService) {
    this.local.get('profile').then(profile => {
      this.userName = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });

    console.log(this.auth.authenticated());
  }

  login(credentials) {
    console.log(credentials);
    // this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
    //
    //   .subscribe(
    //     data => {
    //       console.log(data);
    //       this.authSuccess(data.token)
    //     },
    //     err => this.error = err
    //   );

    var creds = "name=" + credentials.name + "&password=" + credentials.password;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post('http://localhost:3333/authenticate', creds, {headers: headers})
      .map(res => res.json())
      .subscribe(
        data => this.authSuccess(data),
        err => this.error = err
      );
  }

  signup(credentials) {
    console.log(credentials)
    this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => {
          console.log(data);
          this.authSuccess(data.id_token)
        },
        err => this.error = err
      );
  }

  logout() {
    this.local.remove('id_token');
    this.local.remove('profile');
    this.userName = null;
  }


  authSuccess(data) {
    console.log(data);
    var id_token = data.id_token;

    if(!!id_token) {
      this.error = null;
      this.userName = this.jwtHelper.decodeToken(id_token).user.name;
      this.local.set('id_token', id_token);
      this.local.set('profile', JSON.stringify(this.userName));

      console.log("this.user", this.userName);
      console.log("this.auth.authenticated()", this.auth.authenticated());
    }

  }
}
