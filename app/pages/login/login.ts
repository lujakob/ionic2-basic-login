import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthService} from '../../services/auth.service';
import {UserPage} from '../user/user';
import {SignupPage} from '../signup/signup';

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {

    private usercreds: any;
    private service: any;
    private nav: any;
    constructor(private authService: AuthService, private navController: NavController) {
        this.usercreds = {
            name: '',
            password: ''
        }
        this.service = authService;
        this.nav = navController;
    }
    login(user) {
        this.service.authenticate(user).then(data => {
            if(data) {
                this.nav.setRoot(UserPage);
            }
    });
}
    signup() {
        this.nav.push(SignupPage);
    }
}
