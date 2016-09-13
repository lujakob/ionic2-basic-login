import { ActionReducer, Action } from '@ngrx/store';

export const initialState = {data: [], nextOffset: 0, total: 0, isFetching: false};
export const content: ActionReducer<any> = (state: any = initialState, action: Action) => {
  switch(action.type) {
    case 'REQUEST_CONTENT':
      return Object.assign({}, state, {isFetching: true});
    case 'RESET_CONTENT':
      return Object.assign({}, state, initialState);
    case 'GET_CONTENT':
      return Object.assign({}, action.payload, {isFetching: false});
    case 'RECEIVE_CONTENT':
      return Object.assign({}, action.payload, {isFetching: false});
    case 'RECEIVE_ADDITIONAL_CONTENT':
      return Object.assign({}, state, {data: state.data.concat(action.payload.data), nextOffset: action.payload.nextOffset, isFetching: false});
    default:
      return state;
  }
};