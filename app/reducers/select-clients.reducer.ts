import { SelectClientsActionTypes, SelectClientsAction } from '../actions/select-clients.actions';

export const selectClients = (state = 0, action:SelectClientsAction = {type:"?"}) => {
  switch (action.type) {
    case SelectClientsActionTypes.SELECT_CLIENT: {
      return action.clientId;
    }
    default:
      return state;
  }
};

export const selectedClientSelector = state => state.selectClients;

