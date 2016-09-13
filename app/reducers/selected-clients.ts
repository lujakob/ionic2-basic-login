import { ActionReducer, Action } from '@ngrx/store';

export const SELECT_CLIENT = 'SELECT_CLIENT';

export const selectedClients: ActionReducer<number> = (state: number = 0, action: Action) => {
  switch(action.type) {
    case SELECT_CLIENT:
      return action.payload;
    default:
      return state;
  }
};