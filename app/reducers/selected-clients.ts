import { ActionReducer, Action } from '@ngrx/store';

//export const SELECT_CLIENT = 'SELECT_CLIENT';
import { SelectClientActions } from '../actions/select-clients.actions';

export const selectedClients: ActionReducer<number> = (state: number = 0, action: Action) => {
  switch(action.type) {
    case SelectClientActions.SELECT_CLIENT:
      return action.payload;
    default:
      return state;
  }
};