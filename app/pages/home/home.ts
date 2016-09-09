import { Component, Inject } from '@angular/core';

import { AppStore } from "angular2-redux";
import { CounterActions } from "../../actions/counter-actions";
import { counterSelector }from "../../reducers/counter-reducer";

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: []
})
export class HomePage {
  public clientId: number = 0;
  private counter$;
  private counter;
  private unsubscribe:()=>void;

  constructor(private _appStore:AppStore,
              private _counterActions:CounterActions) {

    //this.counter$ = _appStore.select(counterSelector);

    _appStore.select(counterSelector).subscribe(counter => {
      this.counter = counter;
    });

  }

  increment() {
    this._appStore.dispatch(this._counterActions.increment());
    console.log("increment");
  }

  decrement() {
    this._appStore.dispatch(this._counterActions.decrement());
    console.log("decrement");
  }

  // public ngOnDestroy() {
  //   // unsubscribe when the component is destroyed
  //   this.unsubscribe();
  // }
  // constructor(@Inject(AppStore) private store: Store<AppState>) {
  //   store.subscribe(() => this.readState());
  //   this.readState();
  // }

  // readState() {
  //   let state: AppState = this.store.getState() as AppState;
  //   this.clientId = state.clientId;
  // }
  //


}
