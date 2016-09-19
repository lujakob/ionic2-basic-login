import { SelectClientsActionTypes, SelectClientsAction } from '../actions/select-clients.actions';

export const initialState = {isFetching: '?', selectedClient: 0, list: [], applied: [], nextOffset: 0};

export const selectClients = (state:any = initialState, action:SelectClientsAction = {type:"?"}) => {
    switch (action.type) {
        case SelectClientsActionTypes.SELECT_CLIENT: {
            return Object.assign({}, state, {selectedClient: action.clientId });
        }
        case SelectClientsActionTypes.APPLY_SELECTED_CLIENTS: {
            return Object.assign({}, state, {
                applied: state.applied.concat(state.list.filter(client => client.state === 'selected')),
                list: state.list.map(client => {
                    if(client.state === 'selected') {
                        client.state = 'applied';
                    }
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
        case SelectClientsActionTypes.UPDATE_CLIENT_STATE: {
            return Object.assign({}, state, {
                list: state.list.map(item => {
                    if(item.id === action.clientId) {
                        item.state = action.state;
                    }
                    return item;
                }),
                applied: state.applied.map(item => {
                    if(item.id === action.clientId) {
                        item.state = action.state;
                    }
                    return item;
                })

            });
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

