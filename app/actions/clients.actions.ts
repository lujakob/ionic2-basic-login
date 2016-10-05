import { Injectable } from '@angular/core';
import { Actions, AppStore } from 'angular2-redux';
import { ClientService } from '../services/client.service';
import { CLIENTS_PER_PAGE } from '../config/config';
import * as _ from 'lodash';

type Types = 'SELECT_CLIENT | REQUEST_CLIENTS | RECEIVE_CLIENTS | RECEIVE_SELECTED_CLIENTS | RESET_OFFSET | UPDATE_CLIENT | UPDATE_CLIENT_STATE | APPLY_SELECTED_CLIENTS | APPLY_DESELECTED_CLIENTS | SELECT_ALL_CLIENTS | DESELECT_ALL_CLIENTS';
export const ClientsActionTypes = {
    SET_ORDER_BY: 'SET_ORDER_BY' as Types,
    SELECT_CLIENT: 'SELECT_CLIENT' as Types,
    REQUEST_CLIENTS: 'REQUEST_CLIENTS' as Types,
    RECEIVE_CLIENTS: 'RECEIVE_CLIENTS' as Types,
    RECEIVE_SELECTED_CLIENTS: 'RECEIVE_SELECTED_CLIENTS' as Types,
    RESET_OFFSET: 'RESET_OFFSET' as Types,
    UPDATE_CLIENT_STATE: 'UPDATE_CLIENT_STATE' as Types,
    UPDATE_CLIENT: 'UPDATE_CLIENT' as Types,
    APPLY_SELECTED_CLIENTS: 'APPLY_SELECTED_CLIENTS' as Types,
    APPLY_DESELECTED_CLIENTS: 'APPLY_DESELECTED_CLIENTS' as Types,
    SELECT_ALL_CLIENTS: 'SELECT_ALL_CLIENTS' as Types,
    DESELECT_ALL_CLIENTS: 'DESELECT_ALL_CLIENTS' as Types
};

export interface ClientsAction {
    type: string;
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
    direction?;
    reset?;
}

// export interface ContentActionsInterface {
//   type:string;
//
// }

@Injectable()
export class ClientsActions extends Actions {
    private _appStore: AppStore;

    constructor(
        appStore: AppStore,
        private clientService: ClientService) {
            super(appStore);
            this._appStore = appStore;

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
    receiveClients(data, direction) {
        return {
            type: ClientsActionTypes.RECEIVE_CLIENTS,
            allClients: data.data,
            total: data.total,
            direction: direction
        };
    }
    receiveSelectedClients(data) {
        return {
            type: ClientsActionTypes.RECEIVE_SELECTED_CLIENTS,
            selectedClients: data.data,
            nextOffset: data.nextOffset,
            total: data.total
        };
    }

    /**
     * resetNextOffset
     * @returns {{type: (Types|any)}}
     */
    resetOffset() {
        return {
            type: ClientsActionTypes.RESET_OFFSET
        };
    }

    updateClientState(clientId, clientState, view, offset = 0) {
        return (dispatch) => {
            if (view === 'all') {
                let path = '/?1=1' + (offset > 0 ? '&offset=' + offset : '') + '&payee=' + clientId;
                // only get child clients when client state is unselected
                if (clientState === '') {
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
        };
    }

    applySelectedClients() {
        return {
            type: ClientsActionTypes.APPLY_SELECTED_CLIENTS
        };
    }
    applyDeselectedClients() {
        return {
            type: ClientsActionTypes.APPLY_DESELECTED_CLIENTS
        };
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
        };
    }

    orderClients(orderByField, segmentView) {
        let selectedIds = segmentView === 'selected' ? _.union(this._appStore.getState().clients.selected, this._appStore.getState().clients.applied) : [];
        return (dispatch) => {
            dispatch(this.setOrderBy(orderByField));
            dispatch(this.resetOffset());
            dispatch(this.fetchClients('next', selectedIds));
        };
    }

    setOrderBy(orderByField, reset = false) {
        return {
            type: ClientsActionTypes.SET_ORDER_BY,
            orderByField: orderByField,
            reset: reset
        };
    }

    // fetchClients( offset = 0, limit = 100, orderBy = {field: 'path', direction: 'asc'}, selectedIds = []) {
    fetchClients(direction = 'next', selectedIds = []) {
        let offset = (direction === 'next' ? this._appStore.getState().clients.nextOffset : this._appStore.getState().clients.prevOffset),
            limit = CLIENTS_PER_PAGE,
            orderBy = this._appStore.getState().clients.orderBy;

        return (dispatch) => {
            if (offset < 0) {
                return false;
            }
            let path = '/?1=1&sortColumn=' + orderBy.field + '&isAsc=' + (orderBy.direction === 'asc' ? 'true' : 'false') + (offset > 0 ? '&start=' + offset : '') + (limit > 0 ? '&count=' + limit : '');

            dispatch(this.requestClients());

            this.clientService.getClients(path, selectedIds)
                .map(data => this.setInitialValues(data))
                .map(data => {
                    if (selectedIds.length === 0) {
                        dispatch(this.receiveClients(data, direction));
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

        // data.data[1].status = 'selected';

        return data;
    }
}
