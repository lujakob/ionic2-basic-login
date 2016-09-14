import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";
import {StateUpdates, Effect} from "@ngrx/effects";

import 'rxjs/add/operator/switchMap';
import { ContentService } from "../services/content.service";
import {
  REQUEST_CONTENT,
  RECEIVE_CONTENT,
  RESET_CONTENT
} from "../reducers/content";

import {
  SELECT_CLIENT
} from "../reducers/selected-clients";


@Injectable()
export class ContentEffects {
  constructor(
    private _updates$: StateUpdates<any>,
    private _contentService : ContentService
  ){}

  /**
   * side effect for receiving content
   * @type {"../../Observable".Observable<R>}
   */
  @Effect() fetchContent$ = this._updates$
    .whenAction(REQUEST_CONTENT)
    .switchMap(() => this._contentService.getContent())
    .map((data) => ({ type: RECEIVE_CONTENT, payload: data}));

  /**
   * side effect for triggering REQUEST_CONTENT on client selection
   * @type {"../../Observable".Observable<R>}
   */
  @Effect() selectClient$ = this._updates$
    .whenAction(SELECT_CLIENT)
    .map(({action}) => ({type: REQUEST_CONTENT}));
}