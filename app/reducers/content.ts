import { ActionReducer, Action } from '@ngrx/store';

export const initialState = {data: [], nextOffset: 0, total: 0, isFetching: false};

export const REQUEST_CONTENT = 'REQUEST_CONTENT';
export const RECEIVE_CONTENT = 'RECEIVE_CONTENT';
export const RESET_CONTENT = 'RESET_CONTENT';
export const RESET_OFFSET = 'RESET_OFFSET';

export const content: ActionReducer<any> = (state: any = initialState, action: Action) => {
  switch(action.type) {
    case REQUEST_CONTENT:
      return Object.assign({}, state, {isFetching: true});

    case RECEIVE_CONTENT:
      return Object.assign({}, state, {
        isFetching: false,
        nextOffset: action.payload.nextOffset,
        data: state.nextOffset === 0 ? action.payload.data : state.data.concat(action.payload.data),
        total: action.payload.total
      });

    case RESET_OFFSET:
      return Object.assign({}, state, {nextOffset: 0});

    case RESET_CONTENT:
      return Object.assign({}, state, initialState);

    default:
      return state;
  }
};