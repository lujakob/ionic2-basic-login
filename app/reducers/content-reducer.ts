import { ContentActionTypes, ContentActionsInterface } from '../actions/content-actions';

export const initialState = {isFetching: "?", list: [], nextOffset: 0, total: 0};

export default (state:any = initialState, action:ContentActionsInterface = {type:"?"}) => {
  switch (action.type) {
    case ContentActionTypes.REQUEST_CONTENT:
      return Object.assign({}, state, {isFetching: true});
    case ContentActionTypes.RECEIVE_CONTENT:
      return Object.assign({}, state, {
        isFetching: false,
        list: state.nextOffset === 0 ? action.list : state.list.concat(action.list),
        nextOffset: action.nextOffset,
        total: action.total
      });
    case ContentActionTypes.RESET_NEXT_OFFSET: {
      return Object.assign({}, state, {nextOffset: initialState.nextOffset});
    }

    case ContentActionTypes.RECEIVE_CONTENT_LIST_TOTAL:
      return Object.assign({}, state, {count: action.total});
    default:
      return state;
  }
};

export const contentTotalSelector = state => state.content.total;
export const contentListSelector = state => state.content.list;
export const contentIsFetchingSelector = state => state.content.isFetching;
export const contentNextOffsetSelector = state => state.content.nextOffset;

