import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Actions,AppStore} from "angular2-redux";
import 'rxjs/add/operator/map';

const BASE_URL = "http://localhost:3333/statements";
// const BASE_URL = "data/statementsData.json";

type Types = "REQUEST_STATEMENTS" | "RECEIVE_STATEMENTS" |
  "RECEIVE_STATEMENTS_ADD" |
  "REQUEST_STATEMENT" | "RECEIVE_STATEMENT" |
  "RECEIVE_NUMBER_OF_STATEMENTS" | "CURRENT_STATEMENT" | "SET_NEXT_OFFSET";
export const StatementsActionTypes = {
  REQUEST_STATEMENTS: "REQUEST_STATEMENTS" as Types,
  RECEIVE_STATEMENTS: "RECEIVE_STATEMENTS" as Types,
  RECEIVE_STATEMENTS_ADD: "RECEIVE_STATEMENTS_ADD" as Types,
  REQUEST_STATEMENT: "REQUEST_STATEMENT" as Types,
  RECEIVE_STATEMENT: "RECEIVE_STATEMENT" as Types,
  RECEIVE_NUMBER_OF_STATEMENTS: "RECEIVE_NUMBER_OF_STATEMENTS" as Types,
  CURRENT_STATEMENT: "CURRENT_STATEMENT" as Types,
  SET_NEXT_OFFSET: "SET_NEXT_OFFSET" as Types
};

export interface StatementAction {
  type:string;
  count?;
  statements?;
  statement?;
  currentIndex?,
  nextOffset?;
}

@Injectable()
export class StatementsActions extends Actions {

  constructor(private _http:Http, appStore:AppStore) {
    super(appStore);
  }

  fetchStatements(clientId = 0, offset = 0) {
    return (dispatch) => {
      dispatch(this.requestStatements());
      let url = BASE_URL + '?1=1' + (clientId > 0 ? '&clientId=' + clientId : '') + (offset > 0 ? '&offset=' + offset : '');

      this._http.get(url)
        .map(result => result.json())
        // .map(data => {
        //   if (clientId > 0) {
        //     data = data.filter(item => item.clientId == clientId);
        //   }
        //   return data;
        // })
        .map(data => {
          dispatch(this.setNextOffset(data.nextOffset));
          if(offset > 0) {
            console.log("receiveStatementsAdd");
            dispatch(this.receiveStatementsAdd(data.data));
          } else {
            console.log("receiveStatements");
            dispatch(this.receiveStatements(data.data));
          }

          dispatch(this.receiveNumberOfStatements(data.total));
        })
        .subscribe();
    };
  }

  setNextOffset(nextOffset) {
    return {
      type: StatementsActionTypes.SET_NEXT_OFFSET,
      nextOffset
    }
  }

  fetchStatement(index) {
    return (dispatch) => {
      dispatch(this.requestStatement());

      this._http.get(`${BASE_URL}${index + 1}/`)
        .map(result => result.json())
        .map(json => {
          dispatch(this.receiveStatement(json));
        })
        .subscribe();
    };
  }

  requestStatements() {
    return {type: StatementsActionTypes.REQUEST_STATEMENTS};
  }

  receiveStatements(statements) {
    return {
      type: StatementsActionTypes.RECEIVE_STATEMENTS,
      statements
    }
  }

  receiveStatementsAdd(statements) {
    return {
      type: StatementsActionTypes.RECEIVE_STATEMENTS_ADD,
      statements
    }
  }

  receiveNumberOfStatements(count) {
    return {
      type: StatementsActionTypes.RECEIVE_NUMBER_OF_STATEMENTS,
      count
    }
  }

  requestStatement() {
    return {type: StatementsActionTypes.REQUEST_STATEMENT};
  }

  receiveStatement(statement) {
    return {
      type: StatementsActionTypes.RECEIVE_STATEMENT,
      statement
    }
  }

  setCurrentStatement(currentIndex) {
    return {
      type: StatementsActionTypes.CURRENT_STATEMENT,
      currentIndex
    }
  }
}
