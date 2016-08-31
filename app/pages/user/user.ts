import { Component } from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {AuthService} from '../../services/authservice';
import {HomePage} from '../home/home';

@Component({
    templateUrl: 'build/pages/user/user.html'
})
export class UserPage {

    private service: any;
    private nav: NavController;

    constructor(private authservice: AuthService, private navcontroller: NavController, private alertController: AlertController) {
        this.service = authservice;
        this.nav = navcontroller;
    }
    
    logout() {
        this.service.logout();
        this.nav.setRoot(HomePage);
    }
    
    getinfo() {
        this.service.getinfo().then(data => {
            if(data.success) {
                let alert = this.alertController.create({
                    title: data.success,
                    subTitle: data.msg,
                    buttons: ['OK']
                });
                alert.present();
            }
        });
    }
}