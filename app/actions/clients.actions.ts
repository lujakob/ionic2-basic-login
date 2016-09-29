import {Injectable} from "@angular/core";
import {Actions, AppStore} from "angular2-redux";
import { ClientService } from '../services/client.service';

type Types = 'SELECT_CLIENT | REQUEST_CLIENTS | RECEIVE_CLIENTS | RECEIVE_SELECTED_CLIENTS | RESET_NEXT_OFFSET | UPDATE_CLIENT | UPDATE_CLIENT_STATE | APPLY_SELECTED_CLIENTS | APPLY_DESELECTED_CLIENTS | SELECT_ALL_CLIENTS | DESELECT_ALL_CLIENTS';
export const ClientsActionTypes = {
    SET_ORDER_BY: 'SET_ORDER_BY' as Types,
    SELECT_CLIENT: 'SELECT_CLIENT' as Types,
    REQUEST_CLIENTS: 'REQUEST_CLIENTS' as Types,
    RECEIVE_CLIENTS: 'RECEIVE_CLIENTS' as Types,
    RECEIVE_SELECTED_CLIENTS: 'RECEIVE_SELECTED_CLIENTS' as Types,
    RESET_NEXT_OFFSET: 'RESET_NEXT_OFFSET' as Types,
    UPDATE_CLIENT_STATE: 'UPDATE_CLIENT_STATE' as Types,
    UPDATE_CLIENT: 'UPDATE_CLIENT' as Types,
    APPLY_SELECTED_CLIENTS: 'APPLY_SELECTED_CLIENTS' as Types,
    APPLY_DESELECTED_CLIENTS: 'APPLY_DESELECTED_CLIENTS' as Types,
    SELECT_ALL_CLIENTS: 'SELECT_ALL_CLIENTS' as Types,
    DESELECT_ALL_CLIENTS: 'DESELECT_ALL_CLIENTS' as Types
};

export interface ClientsAction {
    type:string;
    client?;
    clientId?;
    total?;
    allClients?;
    selectedClients?;
    nextOffset?;
    state?;
    clientState?;
    view?;
    orderByField?;
    orderByDirection?;
}

// export interface ContentActionsInterface {
//   type:string;
//
// }

@Injectable()
export class ClientsActions extends Actions {
    constructor(
        appStore: AppStore,
        private clientService: ClientService) {
            super(appStore);
    }

    /**
     * requestClients
     * @returns {{type: (Types|any)}}
     */
    requestClients() {
        return {type: ClientsActionTypes.REQUEST_CLIENTS};
    }

    /**
     * receiveClients
     * @param data
     * @returns {{type: (Types|any), list: any, nextOffset: (any|number), total: (any|number)}}
     */
    receiveClients(data) {
        return {
            type: ClientsActionTypes.RECEIVE_CLIENTS,
            allClients: data.data,
            nextOffset: data.nextOffset,
            total: data.total
        }
    }
    receiveSelectedClients(data) {
        return {
            type: ClientsActionTypes.RECEIVE_SELECTED_CLIENTS,
            selectedClients: data.data,
            nextOffset: data.nextOffset,
            total: data.total
        }
    }

    /**
     * resetNextOffset
     * @returns {{type: (Types|any)}}
     */
    resetNextOffset() {
        return {
            type: ClientsActionTypes.RESET_NEXT_OFFSET
        }
    }

    updateClientState(clientId, clientState, view, offset = 0) {
        return (dispatch) => {
            if(view === 'all') {
                let path = '/?1=1' + (offset > 0 ? '&offset=' + offset : '') + '&payee=' + clientId;
                // only get child clients when client state is unselected
                if(clientState === '') {
                    this.clientService.getClients(path)
                        .map(data => this.setInitialValues(data))
                        .map(data => {
                            dispatch(this.updateClient(clientId, clientState, view));
                            data.data.map(item => {
                                dispatch(this.updateClient(item.id, clientState, view));
                            });
                        })
                        .subscribe();
                } else {
                    dispatch(this.updateClient(clientId, clientState, view));
                }
            } else {
                dispatch(this.updateClient(clientId, clientState, view));
            }
        };
    }

    updateClient(clientId, clientState, view) {
        return {
            type: ClientsActionTypes.UPDATE_CLIENT,
            clientId: clientId,
            view: view,
            clientState: clientState
        }
    }

    applySelectedClients() {
        return {
            type: ClientsActionTypes.APPLY_SELECTED_CLIENTS
        }
    }
    applyDeselectedClients() {
        return {
            type: ClientsActionTypes.APPLY_DESELECTED_CLIENTS
        }
    }

    selectAllClients(view) {
        return {
            type: ClientsActionTypes.SELECT_ALL_CLIENTS,
            view: view
        };
    }

    deselectAllClients(view) {
        return {
            type: ClientsActionTypes.DESELECT_ALL_CLIENTS,
            view: view
        };
    }

    selectClient(clientId) {
        return {
            type: ClientsActionTypes.SELECT_CLIENT,
            clientId: clientId
        }
    }

    setOrderBy(orderByField) {
        return {
            type: ClientsActionTypes.SET_ORDER_BY,
            orderByField: orderByField
        }
    }

    fetchClients( offset = 0, orderBy = {field: 'path', direction: 'asc'}, selectedIds = []) {
        return (dispatch) => {
            let path = '/?1=1&sortColumn=' + orderBy.field + '&isAsc=' + (orderBy.direction === 'asc' ? 'true' : 'false') + (offset > 0 ? '&offset=' + offset : '');

            dispatch(this.requestClients());

            this.clientService.getClients(path, selectedIds)
                .map(data => this.setInitialValues(data))
                .map(data => {
                    if(selectedIds.length === 0) {
                        dispatch(this.receiveClients(data));
                    } else {
                        dispatch(this.receiveSelectedClients(data));
                    }

                })
                .subscribe();

        };
    }


    // setClientStates() {
    //     return {
    //         type: ClientsActionTypes.SET_CLIENT_STATES
    //     }
    // }

    /**
     * add initial properties to data
     * @param data
     * @returns {any}
     */
    setInitialValues(data) {
        // add property 'state' (initially empty '') to all client items
        data = Object.assign({}, data, {data: data.data.map(client => {
            return Object.assign({}, client, {state: ''});
        })});

        //data.data[1].status = 'selected';

        return data;
    }
}
