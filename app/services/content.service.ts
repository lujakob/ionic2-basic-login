import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/skip';
import { Http, Headers } from '@angular/http';

const BASE_URL = 'http://localhost:3333/statements/';
const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class ContentService {
  //content:Observable <any>;

  private nextOffset: number = 0;
  private selectedClients: any = 0;

  constructor(
    private store:Store<any>,
    private http: Http
  ) {

    store.select(state => state.content.nextOffset).subscribe(nextOffset => {
      this.nextOffset = nextOffset;
    });
    store.select('selectedClients').skip(1).subscribe(selectedClients => {
      this.selectedClients = selectedClients;
    });

  }
  getContent() {

    let url = BASE_URL + '?1=1' + (this.selectedClients > 0 ? '&clientId=' + this.selectedClients : '') + (this.nextOffset > 0 ? '&offset=' + this.nextOffset : '');
    console.log("url", url);

    return this.http.get(url)
      .map(res => res.json());

    // this.store.dispatch({type: 'REQUEST_CONTENT'});
    // console.log("url", url);
    // this.http.get(url)
    //   .map(res => res.json())
    //   // .map(res => {
    //   //   console.log(res);
    //   //   return res;
    //   // })
    //   .map(payload => {
    //     if(this.nextOffset > 0) {
    //       return { type: 'RECEIVE_ADDITIONAL_CONTENT', payload };
    //     } else {
    //       return { type: 'RECEIVE_CONTENT', payload };
    //     }
    //   })
    //   .subscribe(action => this.store.dispatch(action));
  }
}