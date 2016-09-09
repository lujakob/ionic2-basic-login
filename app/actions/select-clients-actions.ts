import {Injectable} from "@angular/core";
import {Actions, AppStore} from "angular2-redux";

type Types = "SELECT_CLIENT";
export const SelectClientsActionTypes = {
  SELECT_CLIENT: "SELECT_CLIENT" as Types
};

export interface SelectClientsAction {
  type:string;
  clientId?;
}

@Injectable()
export class SelectClientsActions extends Actions {

  constructor(appStore:AppStore) {
    super(appStore);
  }

  selectClient(clientId) {
    return {
      type: SelectClientsActionTypes.SELECT_CLIENT,
      clientId: clientId
    }
  }
}
