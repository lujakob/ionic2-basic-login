import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs/Rx";

export const BASE_URL = "http://localhost:3333/statements";
// const BASE_URL = "data/statementsData.json";

export type IAPIContent = {
  data: any[],
  nextOffset: number,
  total: number
};

@Injectable()
export class ContentService {
  constructor(private _http:Http) {

  }

  /**
   *
   * @param path
   * @returns {Observable<R>}
   */
  getContent(path:string = ''):Observable<IAPIContent> {
    return this._http.get(BASE_URL + path)
      .map<IAPIContent>(res => res.json());
  }
}