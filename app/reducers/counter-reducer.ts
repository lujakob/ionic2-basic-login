import { CounterActionTypes, CounterAction} from '../actions/counter-actions';

export default (state = 0, action:CounterAction = {type:"?"}) => {
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

