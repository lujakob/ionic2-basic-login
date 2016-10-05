import { Injectable } from '@angular/core';
import { Actions, AppStore } from 'angular2-redux';
import 'rxjs/add/operator/map';

import { ContentService } from '../services/content.service';

type Types = 'SET_USER_DATA';
export const UserActionTypes = {
    SET_USER_DATA: 'SET_USER_DATA' as Types
};

export interface UserActionsInterface {
    type:string;
    username?;
    singleClient?;
    allClients?;
}

@Injectable()
export class UserActions extends Actions {

    constructor(
        appStore:AppStore) {
        super(appStore);
    }

    setUserData(user) {
        return {
            type: UserActionTypes.SET_USER_DATA,
            username: user.name
        }
    }
}
