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


