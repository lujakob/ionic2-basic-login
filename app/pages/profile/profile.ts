import { Component } from '@angular/core';
import { App, NavController, ToastController } from 'ionic-angular';

import {Storage, LocalStorage, Nav} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {FORM_DIRECTIVES} from '@angular/forms';
import {JwtHelper} from 'angular2-jwt';
import {AuthService} from '../../services/auth/auth';
import 'rxjs/add/operator/map'
import {TabsPage} from "../tabs/tabs";

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

  constructor(
    private http:Http,
    private auth:AuthService,
    private nav: NavController,
    private app: App,
    private toastCtrl: ToastController
  ) {
    this.local.get('profile').then(profile => {
      this.userName = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });

    console.log("authenticated", this.auth.authenticated());
  }

  login(credentials) {

    var creds = "name=" + credentials.name + "&password=" + credentials.password;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post('http://localhost:3333/authenticate', creds, {headers: headers})
      .map(res => res.json())
      .subscribe(
        data => {
          this.authSuccess(data);
        },
        err => {
          let toast = this.toastCtrl.create({
            message: JSON.parse(err._body).msg,
            duration: 2000,
            position: 'top'
          });
          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });

          toast.present();
          //this.error = JSON.parse(err._body);
        }
      );
  }

  signup(credentials) {

    this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => {
          this.authSuccess(data.id_token)
        },
        err => this.error = err
      );
  }

  logout() {
    this.local.remove('id_token');
    this.local.remove('profile');
    this.userName = null;
    this.app.getRootNav().setRoot(ProfilePage);
  }

  authSuccess(data) {
    var id_token = data.id_token;

    if(!!id_token) {
      this.error = null;
      this.userName = this.jwtHelper.decodeToken(id_token).user.name;
      this.local.set('id_token', id_token);
      this.local.set('profile', JSON.stringify(this.userName));

      this.nav.setRoot(TabsPage);
    }

  }
}
