import {Injectable, Inject} from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable()
export class AuthService {
    private isLoggedin: any;
    private AuthToken: any;
    constructor(private http: Http) {
        this.isLoggedin = false;
        this.AuthToken = null;
    }

    storeUserCredentials(userdata) {
        window.localStorage.setItem('userdata', JSON.stringify(userdata));
        this.useCredentials(userdata);

    }

    useCredentials(userdata) {
        this.isLoggedin = !!true;
        this.AuthToken = userdata;
    }

    loadUserCredentials() {
        var token = JSON.parse(window.localStorage.getItem('userdata'));
        this.useCredentials(token);
    }

    destroyUserCredentials() {
        this.isLoggedin = false;
        this.AuthToken = null;
        window.localStorage.clear();
    }

    authenticate(user) {
        var creds = btoa(user.name + ":" + user.password);
        var headers = new Headers();
        // headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', ' Basic ' + creds);

        return new Promise(resolve => {
            this.http.get('http://localhost:8080/me', {headers: headers}).subscribe(data => {
                if(data.json()){
                    this.storeUserCredentials({
                        "username": user.name,
                        "password": user.password,
                        "email": data.json().email
                    });
                    resolve(true);
                }
                else
                    resolve(false);
            });
        });
    }
    adduser(user) {
        var creds = "name=" + user.name + "&password=" + user.password;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return new Promise(resolve => {
            this.http.post('http://localhost:3333/adduser', creds, {headers: headers}).subscribe(data => {
                if(data.json().success){
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    isAuthenticated() {
      return this.isLoggedin;
    }

    getinfo() {
        return new Promise(resolve => {
            var headers = new Headers();
            this.loadUserCredentials();
            resolve(this.AuthToken);
            // headers.append('Authorization', 'Bearer ' + this.AuthToken);
            // this.http.get('http://localhost:3333/getinfo', {headers: headers}).subscribe(data => {
            //     if(data.json().success)
            //         resolve(data.json());
            //     else
            //         resolve(false);
            // });
        })
    }

    logout() {
        this.destroyUserCredentials();
    }
}