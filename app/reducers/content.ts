import { ActionReducer, Action } from '@ngrx/store';

export const initialState = {data: [], nextOffset: 0, total: 0};
export const content: ActionReducer<any> = (state: any = initialState, action: Action) => {
  switch(action.type) {
    case 'GET_CONTENT':
      return action.payload;
    case 'LOAD_CONTENT':
      return action.payload;
    case 'ADD_CONTENT_ITEMS':
      return Object.assign({}, state, {data: state.data.concat(action.payload.data)});
    default:
      return state;
  }
};