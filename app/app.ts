import {Component, ViewChild, provide, PLATFORM_DIRECTIVES} from '@angular/core';
import { Http } from '@angular/http';
import { ionicBootstrap, Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { ProfilePage } from './pages/profile/profile';

import { TabsPage } from './pages/tabs/tabs';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { ClientListButton } from './components/client-list-button.component';
import { ClientSelectButton } from './components/client-select-button.component';
import { BmgInfiniteScrollContent } from './components/bmg-infinite-scroll-content.component';

import { AppStore, createAppStoreFactoryWithOptions } from "angular2-redux";
import reducers from "./reducers/app.reducer";
import { FilmActions } from "./actions/film.actions";
import { CounterActions } from "./actions/counter.actions";
import { ContentActions } from "./actions/content.actions";
import { SelectClientsActions } from "./actions/select-clients.actions";

import { AuthService } from './services/auth/auth';
import { ContentService } from './services/content.service';
import { ClientService } from './services/client.service';

// my logger middleware
const loggerMiddleware = store => next => action => {
    console.log('dispatching', action);
    return next(action);
};

const appStoreFactory = createAppStoreFactoryWithOptions({
    reducers,
    additionalMiddlewares:[loggerMiddleware],
    debug:true
});

@Component({
    templateUrl: 'build/app.html',
    directives: [ClientListButton, ClientSelectButton, BmgInfiniteScrollContent]
})
export class MyApp {
    @ViewChild('myNav') nav: Nav;

    // make HelloIonicPage the root (or first) page
    rootPage: any;
    pages: Array<{title: string, component: any}>;

    constructor(
        public platform: Platform,
        public menu: MenuController,
        public service: AuthService
    ) {

        this.initializeAuthGuard();
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }

    initializeAuthGuard() {
        if(this.service.authenticated()) {
            this.rootPage = TabsPage;
        } else {
            this.rootPage = ProfilePage;
        }
    }
    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        // navigate to the new page if it is not the current page
        this.nav.setRoot(page.component);
    }
}

ionicBootstrap(MyApp, [
    AuthService,
    ContentService,
    ClientService,
    FilmActions,  CounterActions, SelectClientsActions, ContentActions,
    {provide: AppStore, useFactory: appStoreFactory },
    {provide: AuthHttp,
        useFactory: (http) => {
            return new AuthHttp(new AuthConfig, http);
        },
        deps: [Http]
    },
    {provide: PLATFORM_DIRECTIVES, useValue: [ClientListButton, ClientSelectButton, BmgInfiniteScrollContent], multi: true}
]);

