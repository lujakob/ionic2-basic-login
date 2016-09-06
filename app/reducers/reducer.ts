/**
 * Counter Reducer
 */
import { Reducer, Action } from 'redux';
import { AppState } from '../app-state';
import {
  SET_CLIENT,
  INCREMENT
} from '../actions/actions-creators';

let initialState: AppState = { clientId: 0 };

// Create our reducer that will handle changes to the state
// argument action should be of type Action, but is changed to any because of property clientId not accepted/error
export const clientReducer: Reducer<AppState> =
  (state: AppState = initialState, action: any): AppState => {
    switch (action.type) {
      case SET_CLIENT:
        return Object.assign({}, state, { clientId: action.clientId });
      case INCREMENT:
        return Object.assign({}, state, { clientId: state.clientId + 1 });

      default:
        return state;
    }
  };
