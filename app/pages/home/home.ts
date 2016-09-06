import { Component, Inject } from '@angular/core';

import { Store } from 'redux';
import { AppStore } from '../../app-store';
import { AppState } from '../../app-state';
import * as ClientActions from '../../actions/actions-creators';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: []
})
export class HomePage {
  public clientId: number = 0;
  constructor(@Inject(AppStore) private store: Store<AppState>) {
    store.subscribe(() => this.readState());
    this.readState();
  }

  readState() {
    let state: AppState = this.store.getState() as AppState;
    this.clientId = state.clientId;
  }

  increment() {
    this.store.dispatch(ClientActions.incrementClient());
    console.log("increment");
  }

}
