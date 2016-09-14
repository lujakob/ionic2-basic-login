import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/skip';
import { Http, Headers } from '@angular/http';

const BASE_URL = 'http://localhost:3333/statements/';
const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class ContentService {

  private nextOffset: number = 0;
  private selectedClients: any = 0;

  constructor(
    private store:Store<any>,
    private http: Http
  ) {

    // update nextOffset on state.content.nextOffset change
    store.select(state => state.content.nextOffset).subscribe(nextOffset => {
      this.nextOffset = nextOffset;
    });
    // update selectedClients on state.selectedClients change
    store.select('selectedClients').skip(1).subscribe(selectedClients => {
      this.selectedClients = selectedClients;
    });
  }

  getContent() {
    let url = BASE_URL + '?1=1' + (this.selectedClients > 0 ? '&clientId=' + this.selectedClients : '') + (this.nextOffset > 0 ? '&offset=' + this.nextOffset : '');

    return this.http.get(url).map(res => res.json());
  }
}