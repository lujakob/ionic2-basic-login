import { Injectable, Inject } from "@angular/core";
import { Actions, AppStore } from "angular2-redux";

type Types = "INCREMENT" | "DECREMENT";
export const CounterActionTypes = {
  INCREMENT: "INCREMENT" as Types,
  DECREMENT: "DECREMENT" as Types
};

export interface CounterAction {
  type:string;
  count?;
}

@Injectable()
export class CounterActions extends Actions {

  // constructor(@Inject(AppStore) appStore:AppStore) {
  constructor(appStore:AppStore) {
    super(appStore);
  }

  increment() {
    return {
      type: CounterActionTypes.INCREMENT
    }
  }
  decrement() {
    return {
      type: CounterActionTypes.DECREMENT
    }
  }

}
