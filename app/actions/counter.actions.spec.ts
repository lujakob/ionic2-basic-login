import { inject, addProviders } from '@angular/core/testing';
import { CounterActions, CounterActionTypes } from './counter.actions';
import { Actions, AppStore } from "angular2-redux";
import { createStore } from 'redux';

let appStoreMock:AppStore;
let counterActions;

const createAppStoreMock = () => {
  const appStoreMock:AppStore = new AppStore(createStore(state => state));
  spyOn(appStoreMock, "dispatch");
  return appStoreMock;
};


/**
 * @info: see more information on mocking the appStore for instantiating the CounterActions object in angular2-redux/test/actions.spec.ts
 */
describe('CounterActions', () => {
//  beforeEach(() => addProviders([CounterActions, Actions, AppStore]));

  beforeEach(() => {
    appStoreMock = <AppStore>createAppStoreMock();
    counterActions = new CounterActions(appStoreMock);
  });

  describe('increment', () => {
    it('should increment the state for 1', () => {
      let actual = counterActions.increment();
      let expected = {type: CounterActionTypes.INCREMENT };
      expect(actual).toEqual(expected);
    });
  });

  describe('decrement', () => {
    it('should decrement the state for 1', () => {
      let actual = counterActions.decrement();
      let expected = {type: CounterActionTypes.DECREMENT };
      expect(actual).toEqual(expected);
    });
  });

});