import { UserActionTypes, UserActionsInterface } from '../actions/user.actions';

export const initialState = { username: '', singleClient: false, allClients:true };

export const user = (state:any = initialState, action: UserActionsInterface = {type:"?"}) => {
    switch (action.type) {
        case UserActionTypes.SET_USER_DATA:
            return Object.assign({}, state, {
                username: action.username
            });

        default:
            return state;

    }
};

export const usernameSelector = state => state.user.username;
export const singleClientSelector = state => state.user.singleClient;
export const allClientsSelector = state => state.user.allClients;

