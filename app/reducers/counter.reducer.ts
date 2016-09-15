import { CounterActionTypes, CounterAction} from '../actions/counter.actions';

export const initialState = 0;

export const counter = (state = initialState, action:CounterAction = {type:"?"}) => {
  switch (action.type) {
    case CounterActionTypes.INCREMENT: {
      return state + 1;
    }
    case CounterActionTypes.DECREMENT: {
      return state - 1;
    }

    default:
      return state;
  }
};

export const counterSelector = state => state.counter

