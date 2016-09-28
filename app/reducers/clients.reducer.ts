import { ClientsActionTypes, ClientsAction } from '../actions/clients.actions';
import * as _ from 'lodash';

export const initialState = {
    isFetching: false,
    allClients: [],
    selectedClients: [],
    selected: [],
    deselected: [],
    applied: [],
    inList: [],
    nextOffset: 0,
    orderBy: {field: 'name', direction: 'asc'}
};

export const clients = (state:any = initialState, action:ClientsAction = {type:"?"}) => {
    switch (action.type) {

        // request clients - set isFetching
        case ClientsActionTypes.REQUEST_CLIENTS:
            return Object.assign({}, state, {isFetching: true});

        // receive clients - set loaded clients, update client items state and disable isFetching
        case ClientsActionTypes.RECEIVE_CLIENTS:
            return Object.assign({}, state, {
                isFetching: false,
                allClients: action.allClients.map(client => {
                    // set client state to 'selected' or 'applied' if found in according list
                    if(state.selected.indexOf(client.id) >= 0) {
                        client.state = 'selected';
                    } else if(state.applied.indexOf(client.id) >= 0) {
                        client.state = 'applied';
                    }
                    return client;
                }),
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
            let newApplied;

            // add clientId's from selected list
            newApplied = [...state.applied, ...state.selected];
            // remove clientId's from deselected list
            newApplied = newApplied.filter(clientId => {
                return state.deselected.indexOf(clientId) < 0;
            });

            return Object.assign({}, state, {
                allClients: state.allClients.map(client => {
                    if(client.state === 'selected') {
                        client.state = 'applied';
                    } else if(client.state === 'deselected') {
                        client.state = '';
                    }

                    return client;
                }),
                applied: newApplied,
                selected: [],
                deselected: []
            });
        }

        // case ClientsActionTypes.APPLY_DESELECTED_CLIENTS: {
        //     return Object.assign({}, state, {
        //         applied: state.applied.filter(client => client.state === 'applied'),
        //         allClients: state.allClients.map(client => {
        //             if(client.state === 'deselected') {
        //                 client.state = '';
        //             }
        //             return client;
        //         })
        //     });
        // }

        case ClientsActionTypes.UPDATE_CLIENT: {
            let oldClientState = action.clientState;
            let newClientState = getNewState(action);
            let stateChanges:Object;


            // only update state when the client item's state changes
            if(newClientState !== undefined) {

                // first update client state in list of all clients
                stateChanges = {
                    allClients: state.allClients.map(item => {
                        item.state = item.id === action.clientId ? newClientState : item.state;
                        return item;
                    })
                };

                // select: add clientId to list of selected
                if(oldClientState === '' && newClientState === 'selected' && state.applied.indexOf(action.clientId) < 0) {
                    stateChanges = Object.assign({}, stateChanges, {selected: state.selected.indexOf(action.clientId) < 0 ? [...state.selected, action.clientId] : [...state.selected]});
                }

                // remove select: remove clientId to list of selected
                if(oldClientState === 'selected' && newClientState === '' ) {
                    stateChanges = Object.assign({}, stateChanges, {selected: state.selected.filter(clientId => action.clientId !== clientId)});
                }

                // deselect: add clientId to list of deselected
                if(oldClientState === 'applied' && newClientState === 'deselected' ) {
                    stateChanges = Object.assign({}, stateChanges, {deselected: state.deselected.indexOf(action.clientId) < 0 ? [...state.deselected, action.clientId] : [...state.deselected]});
                }

                // remove deselect: remove clientId from list of deselected
                if(oldClientState === 'deselected' && newClientState === 'applied' ) {
                    stateChanges = Object.assign({}, stateChanges, {deselected: state.deselected.filter(clientId => action.clientId !== clientId)});
                }

            }
            return Object.assign({}, state, stateChanges);
        }

        case ClientsActionTypes.SET_ORDER_BY: {
            return Object.assign({}, state, {
                orderBy: {
                    field: action.orderByField,
                    direction: (() => {
                        let newDirection:string;
                        if(action.orderByField === state.orderBy.field) {
                            newDirection = state.orderBy.direction === 'asc' ? 'desc' : 'asc';
                        } else {
                            newDirection = 'asc';
                        }
                        return newDirection;
                    })()
                }
            })
        }

        default:
            return state;
    }
};

/**
 *
 * @param client
 * @returns {string} new client state or undefined if the state should not change
 */
export const getNewState = (action) => {
    var newClientState;
    switch(action.clientState) {
        case '':
            newClientState = 'selected';
            break;
        case 'selected':
            newClientState = '';
            break;
        case 'deselected':
            newClientState = 'applied';
            break;
        case 'applied':
            newClientState = 'deselected';
            break;
        default:
            newClientState = action.clientState;
    }

    return newClientState;
};

export const allClientsSelector = state => state.clients.allClients;
export const selectedClientsSelector = state => state.clients.selectedClients;
export const appliedClientsSelector = state => state.clients.applied;
export const isFetchingSelector = state => state.clients.isFetching;
export const orderBySelector = state => state.clients.orderBy;

