import { Component } from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: []
})
export class HomePage {
  counter$: Observable<number>;
  public clientId: number = 0;
  selectedClient$: Observable<any>;

  constructor(private store: Store<any>) {
    this.counter$ = this.store.select<number>('counter');
    this.selectedClient$ = this.store.select('selectedClients');
  }

  increment() {
    this.store.dispatch({type: 'INCREMENT'});
    console.log("increment");
  }

  decrement() {
    this.store.dispatch({type: 'DECREMENT'});
    console.log("decrement");
  }
}
