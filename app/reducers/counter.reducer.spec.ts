import { counter, initialState} from './counter.reducer';
import { Actions, AppStore } from "angular2-redux";
import { CounterActions } from '../actions/counter.actions';
import { createStore } from 'redux';

let appStoreMock:AppStore;
let counterActions;

const createAppStoreMock = () => {
  const appStoreMock:AppStore = new AppStore(createStore(state => state));
  spyOn(appStoreMock, "dispatch");
  return appStoreMock;
};

describe('Counter reducer', () => {

  beforeEach(() => {
    appStoreMock = <AppStore>createAppStoreMock();
    counterActions = new CounterActions(appStoreMock);
  });

  it('should increment the state', () => {
    let actual = counter(initialState, counterActions.increment());
    let expected = 1;
    expect(actual).toBe(expected);
  });

  it('should decrement the state', () => {
    let actual = counter(initialState, counterActions.decrement());
    let expected = -1;
    expect(actual).toBe(expected);
  });

});