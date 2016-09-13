import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { Http, Headers } from '@angular/http';

const BASE_URL = 'http://localhost:3333/statements/';
const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class ContentService {
  //content:Observable <any>;

  private nextOffset: number = 0;

  constructor(
    private store:Store<any>,
    private http: Http
  ) {
    //this.content = store.select('content');
    store.select(state => state.content.nextOffset).subscribe(nextOffset => {
      this.nextOffset = nextOffset;
    });
    store.select('content').subscribe(content => {
      console.log(content);
    });

  }
  getContent() {

    let clientId = 0;
    let url = BASE_URL + '?1=1' + (clientId > 0 ? '&clientId=' + clientId : '') + (this.nextOffset > 0 ? '&offset=' + this.nextOffset : '');


    this.http.get(url)
      .map(res => res.json())
      // .map(res => {
      //   console.log(res);
      //   return res;
      // })
      .map(payload => {
        if(this.nextOffset > 0) {
          return { type: 'ADD_CONTENT_ITEMS', payload };
        } else {
          return { type: 'LOAD_CONTENT', payload };
        }
      })
      .subscribe(action => this.store.dispatch(action));
  }
}