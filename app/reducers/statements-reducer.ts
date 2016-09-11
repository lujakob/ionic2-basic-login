import { StatementsActionTypes, StatementAction} from '../actions/statements-actions';

export default (state:any = {isFetchingStatements: "?", list: [], currentStatement:"?", nextOffset: 0}, action:StatementAction = {type:"?"}) => {
  switch (action.type) {
    case StatementsActionTypes.REQUEST_STATEMENTS:
      return Object.assign({}, state, {isFetchingStatements: true});
    case StatementsActionTypes.RECEIVE_STATEMENTS:
      return Object.assign({}, state, {isFetchingStatements: false, list: action.statements});
    case StatementsActionTypes.RECEIVE_STATEMENTS_ADD: {
      return Object.assign({}, state, {isFetchingStatements: false, list: state.list.concat(action.statements)});
    }
    case StatementsActionTypes.SET_NEXT_OFFSET: {
      return Object.assign({}, state, {nextOffset: action.nextOffset});
    }

    case StatementsActionTypes.REQUEST_STATEMENT:
      return Object.assign({}, state, {isFetchingStatement: true});
    case StatementsActionTypes.RECEIVE_STATEMENT:
      return Object.assign({}, state, {isFetchingStatement: false, currentStatement: action.statement});
    case StatementsActionTypes.RECEIVE_NUMBER_OF_STATEMENTS:
      return Object.assign({}, state, {count: action.count});
    case StatementsActionTypes.CURRENT_STATEMENT:
      return Object.assign({}, state, {current: action.currentIndex});
    default:
      return state;
  }
};

export const currentStatementSelector = state => state.statements.currentStatement;
export const statementsCountSelector = state => state.statements.count;
export const statementsSelector = state => state.statements.list;
export const isFetchingStatementsSelector = state => state.statements.isFetchingStatements;
export const statementsNextOffsetSelector = state => state.statements.nextOffset;

