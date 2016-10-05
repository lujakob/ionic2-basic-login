import { Injectable }     from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { REST_ENDPOINT, TEST_USER_NAME, TEST_USER_PASSWORD } from '../config/config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export const BASE_URL = REST_ENDPOINT;

export type IAPIClients = {
  data: any[],
  nextOffset: number,
  total: number
};

@Injectable()
export class ClientService {

    constructor (private _http: Http) {}

    /**
     *
     * @param path
     * @returns {Observable<R>}
     */
    getClients(path:string = '', clientIds = []):Observable<IAPIClients> {
        return this._http.post(BASE_URL + path, {clientIds: clientIds})
          .map<IAPIClients>(res => res.json());
    }

    //
    // createAuthorizationHeader(headers:Headers) {
    //     let username = TEST_USER_NAME;
    //     let password = TEST_USER_PASSWORD;
    //     headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
    //     console.log('Basic ' + btoa(username + ':' + password));
    //     console.log(headers);
    // }
    //
    // /**
    //  *
    //  * @param path
    //  * @returns {Observable<R>}
    //  */
    // getClients(path:string = '', clientIds = []):Observable<IAPIClients> {
    //
    //     let headers = new Headers();
    //     this.createAuthorizationHeader(headers);
    //
    //     return this._http.post(BASE_URL + path, {clientIds: clientIds})
    //         .map<IAPIClients>(res => res.json());
    // }


}