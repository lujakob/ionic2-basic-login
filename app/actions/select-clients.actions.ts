import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';


@Injectable()
export class SelectClientActions {

  static SELECT_CLIENT = 'SELECT_CLIENT';

  selectClient(id):Action {
    return {
      type: SelectClientActions.SELECT_CLIENT,
      payload: id
    };
  }
}