import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
    constructor(private jwtHelper: JwtHelper) {

    }

    public authenticated() {
        return tokenNotExpired();
    }

    public getUserData() {
        var token = localStorage.getItem('id_token');
        if(token) {
            return this.jwtHelper.decodeToken(token).user;
        } else {
            return null;
        }
    }
}