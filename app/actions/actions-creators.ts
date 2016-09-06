import {
  Action,
  ActionCreator
} from 'redux';

export const SET_CLIENT: string = 'SET_CLIENT';
export const setClient: ActionCreator<Action> = (clientId: number) => ({
  type: SET_CLIENT,
  clientId: clientId
});

export const INCREMENT: string = 'INCREMENT';
export const incrementClient: ActionCreator<Action> = () => ({
  type: INCREMENT
});

export const REQUEST_CLIENTS = 'REQUEST_CLIENTS'
export const requestClients: ActionCreator<Action> = () =>({
  type: REQUEST_CLIENTS
});

export const RECEIVE_CLIENTS = 'RECEIVE_CLIENTS'
export const receiveClients: ActionCreator<Action> = (json) => ({
  type: RECEIVE_CLIENTS,
  clients: json.data.children.map(child => child.data)
});

export const fetchClients: ActionCreator<Action> = () => {
  return (dispatch) => {
    dispatch(requestClients())
    return fetch('data/clientData.json')
      .then(response => response.json())
      .then(json => dispatch(receiveClients(json)))
  }
};