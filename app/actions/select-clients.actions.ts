import {Injectable} from "@angular/core";
import {Actions, AppStore} from "angular2-redux";
import { ClientService } from '../services/client.service';

type Types = 'SELECT_CLIENT | REQUEST_CLIENTS | RECEIVE_CLIENTS | RESET_NEXT_OFFSET';
export const SelectClientsActionTypes = {
  SELECT_CLIENT: 'SELECT_CLIENT' as Types,
  REQUEST_CLIENTS: 'REQUEST_CLIENTS' as Types,
  RECEIVE_CLIENTS: 'RECEIVE_CLIENTS' as Types,
  RESET_NEXT_OFFSET: 'RESET_NEXT_OFFSET' as Types
};

export interface SelectClientsAction {
  type:string;
  clientId?;
  total?;
  list?;
  nextOffset?;
}

// export interface ContentActionsInterface {
//   type:string;
//
// }


@Injectable()
export class SelectClientsActions extends Actions {
  constructor(
    appStore: AppStore,
    private clientService: ClientService
  ) {
    super(appStore);
  }

  selectClient(clientId) {
    return {
      type: SelectClientsActionTypes.SELECT_CLIENT,
      clientId: clientId
    }
  }

  fetchClients( offset = 0) {
    return (dispatch) => {
      let path = '/?1=1' + (offset > 0 ? '&offset=' + offset : '');
      dispatch(this.requestClients());

      this.clientService.getClients(path)
        .map(data => {
          dispatch(this.receiveClients(data));
        })
        .subscribe();

    };
  }

  requestClients() {
    return {type: SelectClientsActionTypes.REQUEST_CLIENTS};
  }

  receiveClients(data) {
    return {
      type: SelectClientsActionTypes.RECEIVE_CLIENTS,
      list: data.data,
      nextOffset: data.nextOffset,
      total: data.total
    }
  }

  resetNextOffset() {
    return {
      type: SelectClientsActionTypes.RESET_NEXT_OFFSET
    }
  }
}
