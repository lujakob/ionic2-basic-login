import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { Actions, AppStore } from "angular2-redux";
import 'rxjs/add/operator/map';

const BASE_URL = "http://localhost:3333/statements";
// const BASE_URL = "data/statementsData.json";

type Types = "REQUEST_CONTENT" | "RECEIVE_CONTENT" |
  "RECEIVE_CONTENT_ADD" |
  "REQUEST_STATEMENT" | "RECEIVE_STATEMENT" |
  "RECEIVE_CONTENT_LIST_TOTAL" | "CURRENT_STATEMENT" | "RESET_NEXT_OFFSET";
export const ContentActionTypes = {
  REQUEST_CONTENT: "REQUEST_CONTENT" as Types,
  RECEIVE_CONTENT: "RECEIVE_CONTENT" as Types,
  RECEIVE_CONTENT_ADD: "RECEIVE_CONTENT_ADD" as Types,
  REQUEST_STATEMENT: "REQUEST_STATEMENT" as Types,
  RECEIVE_STATEMENT: "RECEIVE_STATEMENT" as Types,
  RECEIVE_CONTENT_LIST_TOTAL: "RECEIVE_CONTENT_LIST_TOTAL" as Types,
  CURRENT_STATEMENT: "CURRENT_STATEMENT" as Types,
  RESET_NEXT_OFFSET: 'RESET_NEXT_OFFSET' as Types
};

export interface ContentActionsInterface {
  type:string;
  total?;
  list?;
  nextOffset?;
}

@Injectable()
export class ContentActions extends Actions {

  constructor(private _http:Http, appStore:AppStore) {
    super(appStore);
  }

  fetchContent(clientId = 0, offset = 0) {
    return (dispatch) => {
      let url = BASE_URL + '?1=1' + (clientId > 0 ? '&clientId=' + clientId : '') + (offset > 0 ? '&offset=' + offset : '');
      dispatch(this.requestContent());

      this._http.get(url)
        .map(res => res.json())
        .map(data => {
          dispatch(this.receiveContent(data));
        })
        .subscribe();
    };
  }


  requestContent() {
    return {type: ContentActionTypes.REQUEST_CONTENT};
  }

  receiveContent(data) {
    return {
      type: ContentActionTypes.RECEIVE_CONTENT,
      list: data.data,
      nextOffset: data.nextOffset,
      total: data.total
    }
  }

  resetNextOffset() {
    return {
      type: ContentActionTypes.RESET_NEXT_OFFSET
    }
  }
}
