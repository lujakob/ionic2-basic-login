import { SelectClientsActionTypes, SelectClientsAction } from '../actions/select-clients.actions';
import * as _ from 'lodash';

export const initialState = {isFetching: '?', selectedClient: 0, list: [], applied: [], nextOffset: 0};

export const selectClients = (state:any = initialState, action:SelectClientsAction = {type:"?"}) => {
    switch (action.type) {
        case SelectClientsActionTypes.SELECT_CLIENT: {
            let newState = Object.assign({}, state, {selectedClient: action.clientId });
            return newState;
        }

        case SelectClientsActionTypes.SELECT_ALL_CLIENTS: {
            var newObj = Object.assign({}, state, {isFetching: true, list: [1]});



            return Object.assign({}, state, {
                list: state.list.map(item => {
                    if (item.state === '') {
                        item.state = 'selected';
                    }
                    return item;
                })
            });
        }

        case SelectClientsActionTypes.DESELECT_ALL_CLIENTS: {
            return Object.assign({}, state, {
                list: state.list.map(item => {
                    item.state = (item.state === 'selected') ? '' : item.state;
                    return item;
                })
            });
        }

        case SelectClientsActionTypes.APPLY_SELECTED_CLIENTS: {
            return Object.assign({}, state, {
                applied: state.applied.concat(state.list.filter(client => client.state === 'selected')),
                list: state.list.map(client => {
                    client.state = (client.state === 'selected') ? 'applied' : client.state;
                    return client;
                })
            });
        }

        case SelectClientsActionTypes.APPLY_DESELECTED_CLIENTS: {
            return Object.assign({}, state, {
                applied: state.applied.filter(client => client.state === 'applied'),
                list: state.list.map(client => {
                    if(client.state === 'deselected') {
                        client.state = '';
                    }
                    return client;
                })
            });
        }

        case SelectClientsActionTypes.UPDATE_CLIENT: {
            let newState = getNewState(action.clientState);
            let stateChanges = {};
            let allAppliedClientsIds = state.list.filter(item => item.state === 'applied').map(item => item.id);

            // return if view is 'all' and current client is already 'applied'
            if(action.view === 'all' && allAppliedClientsIds.indexOf(action.clientId) >= 0) {
                return Object.assign({}, state, stateChanges);
            }

            // only update state when the client item's state changes
            if(newState !== undefined) {
                stateChanges = {
                    list: state.list.map(item => {
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
export const appliedClientsListSelector = state => state.selectClients.applied;

