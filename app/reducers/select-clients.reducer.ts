import { SelectClientsActionTypes, SelectClientsAction } from '../actions/select-clients.actions';

export const initialState = {isFetching: '?', selectedClient: 0, list: [], nextOffset: 0};

export const selectClients = (state:any = initialState, action:SelectClientsAction = {type:"?"}) => {
  switch (action.type) {
    case SelectClientsActionTypes.SELECT_CLIENT: {
      return Object.assign({}, state, {selectedClient: action.clientId});
    }

    case SelectClientsActionTypes.REQUEST_CLIENTS:
      return Object.assign({}, state, {isFetching: true});
    case SelectClientsActionTypes.RECEIVE_CLIENTS:
      return Object.assign({}, state, {
        isFetching: false,
        list: state.nextOffset === 0 ? action.list : state.list.concat(action.list),
        nextOffset: action.nextOffset,
        total: action.total
      });
    case SelectClientsActionTypes.RESET_NEXT_OFFSET: {
      return Object.assign({}, state, {nextOffset: initialState.nextOffset});
    }

    default:
      return state;
  }
};

export const selectedClientSelector = state => state.selectClients.selectedClient;
export const selectedClientsListSelector = state => state.selectClients.list;

