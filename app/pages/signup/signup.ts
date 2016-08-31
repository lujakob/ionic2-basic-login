import { Component } from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {AuthService} from '../../services/authservice';
import { Http, ConnectionBackend } from '@angular/http';

@Component({
  templateUrl: 'build/pages/signup/signup.html',
  providers: [Http, ConnectionBackend]
})
export class SignupPage {
    private newcreds: any;
    private service: AuthService;
    private nav: NavController;
    constructor(private authservice: AuthService, private navcontroller: NavController, private alertController: AlertController) {
        this.newcreds = {
            name: '',
            password: ''
        }
        this.service = authservice;
        this.nav = navcontroller;
    }
    register(user) {
        console.log(user);
        this.service.adduser(user).then(data => {
            if(data) {
                let alert = this.alertController.create({
                    title: 'Success',
                    subTitle: 'User Created',
                    buttons: ['OK']
                });
                alert.present();
            }
        }, error => {
            console.error("Failed!", error);
        });
    }
}