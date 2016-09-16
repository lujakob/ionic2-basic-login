import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export const BASE_URL = "http://localhost:3333/clients";
// const BASE_URL = "data/statementsData.json";

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
  getClients(path:string = ''):Observable<IAPIClients> {
    return this._http.get(BASE_URL + path)
      .map<IAPIClients>(res => res.json());
  }
}