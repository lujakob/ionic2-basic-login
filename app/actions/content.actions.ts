import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';


@Injectable()
export class ContentActions {

  static REQUEST_CONTENT = 'REQUEST_CONTENT';
  static RECEIVE_CONTENT = 'RECEIVE_CONTENT';
  static RESET_CONTENT = 'RESET_CONTENT';
  static RESET_OFFSET = 'RESET_OFFSET';

  requestContent():Action {
    return {
      type: ContentActions.REQUEST_CONTENT
    };
  }

  receiveContent(data):Action {
    return {
      type: ContentActions.RECEIVE_CONTENT,
      payload: data
    };
  }

  resetContent():Action {
    return {
      type: ContentActions.RESET_CONTENT
    }
  }

  resetOffset(): Action {
    return {
      type: ContentActions.RESET_OFFSET
    }
  }
}