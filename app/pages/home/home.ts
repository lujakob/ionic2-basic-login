import { Component } from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {SignupPage} from '../signup/signup';
import {AuthService} from '../../services/authservice';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: []
})
export class HomePage {
  private nav: any;
  constructor(private service: AuthService, private navcontroller: NavController, private alertController: AlertController) {
      this.nav = navcontroller;
      console.log("Authenticated: " + this.service.isAuthenticated());

  }
  signup() {
      this.nav.push(SignupPage);
  }
  openLogin() {
      this.nav.setRoot(LoginPage);
  }

  logout() {
    this.service.logout();
    this.nav.setRoot(HomePage);
  }

}
