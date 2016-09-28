import { ClientsActionTypes, ClientsAction } from '../actions/clients.actions';
import * as _ from 'lodash';

export const initialState = {
    isFetching: false,
    allClients: [],
    selectedClients: [],
    selected: [],
    applied: [],
    inList: [],
    nextOffset: 0
};

export const clients = (state:any = initialState, action:ClientsAction = {type:"?"}) => {
    switch (action.type) {

        // request clients - set isFetching
        case ClientsActionTypes.REQUEST_CLIENTS:
            return Object.assign({}, state, {isFetching: true});

        // receive clients - set loaded clients and disable isFetching
        case ClientsActionTypes.RECEIVE_CLIENTS:
            return Object.assign({}, state, {
                isFetching: false,
                allClients: action.allClients,
                // allClients: state.nextOffset === 0 ? action.allClients : state.allClients.concat(action.allClients),
                nextOffset: action.nextOffset,
                total: action.total
            });

        // reset offset
        case ClientsActionTypes.RESET_NEXT_OFFSET: {
            return Object.assign({}, state, {nextOffset: initialState.nextOffset});
        }

        case ClientsActionTypes.SELECT_CLIENT: {
            let newState = Object.assign({}, state, {selectedClient: action.clientId });
            return newState;
        }

        case ClientsActionTypes.SELECT_ALL_CLIENTS: {
            var newObj = Object.assign({}, state, {isFetching: true, allClients: [1]});



            return Object.assign({}, state, {
                allClients: state.allClients.map(item => {
                    if (item.state === '') {
                        item.state = 'selected';
                    }
                    return item;
                })
            });
        }

        case ClientsActionTypes.DESELECT_ALL_CLIENTS: {
            return Object.assign({}, state, {
                allClients: state.allClients.map(item => {
                    item.state = (item.state === 'selected') ? '' : item.state;
                    return item;
                })
            });
        }

        case ClientsActionTypes.APPLY_SELECTED_CLIENTS: {
            return Object.assign({}, state, {
                applied: state.applied.concat(state.allClients.filter(client => client.state === 'selected')),
                allClients: state.allClients.map(client => {
                    client.state = (client.state === 'selected') ? 'applied' : client.state;
                    return client;
                })
            });
        }

        case ClientsActionTypes.APPLY_DESELECTED_CLIENTS: {
            return Object.assign({}, state, {
                applied: state.applied.filter(client => client.state === 'applied'),
                allClients: state.allClients.map(client => {
                    if(client.state === 'deselected') {
                        client.state = '';
                    }
                    return client;
                })
            });
        }

        case ClientsActionTypes.UPDATE_CLIENT: {
            let newState = getNewState(action.clientState);
            let stateChanges = {};
            let allAppliedClientsIds = state.allClients.filter(item => item.state === 'applied').map(item => item.id);

            // return if view is 'all' and current client is already 'applied'
            if(action.view === 'all' && allAppliedClientsIds.indexOf(action.clientId) >= 0) {
                return Object.assign({}, state, stateChanges);
            }

            // only update state when the client item's state changes
            if(newState !== undefined) {
                stateChanges = {
                    allClients: state.allClients.map(item => {
                        item.state = item.id === action.clientId ? newState : item.state;
                        return item;
                    }),
                    applied: state.applied.map(item => {
                        item.state = item.id === action.clientId ? newState : item.state;
                        return item;
                    })
                };
            }
            return Object.assign({}, state, stateChanges);

            /**
             *
             * @param client
             * @returns {string} new client state or undefined if the state should not change
             */
            function getNewState(clientState) {
                var newClientState;
                if(action.view === 'all') {
                    if(clientState == "") {
                        newClientState = 'selected';
                    } else if(clientState === 'selected') {
                        newClientState = '';
                    }
                } else {
                    if(clientState === 'applied') {
                        newClientState = 'deselected';
                    } else if(clientState === 'deselected') {
                        newClientState = 'applied';
                    }
                }
                return newClientState;
            }
        }


        default:
            return state;
    }
};

export const allClientsSelector = state => state.clients.allClients;
export const selectedClientsSelector = state => state.clients.selectedClients;
export const appliedClientsSelector = state => state.clients.applied;
export const isFetchingSelector = state => state.clients.isFetching;

