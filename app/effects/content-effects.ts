import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";
import {StateUpdates, Effect} from "@ngrx/effects";

import 'rxjs/add/operator/switchMap';
import { ContentService } from "../services/content.service";
import { ContentActions } from '../actions/content.actions';
import { SelectClientActions } from '../actions/select-clients.actions';

@Injectable()
export class ContentEffects {
  constructor(
    private _updates$: StateUpdates<any>,
    private _contentService : ContentService,
    private contentActions: ContentActions
  ){}

  /**
   * side effect for receiving content
   * @type {"../../Observable".Observable<R>}
   */
  @Effect() fetchContent$ = this._updates$
    .whenAction(ContentActions.REQUEST_CONTENT)
    .switchMap(() => this._contentService.getContent())
    .map((data) => (this.contentActions.receiveContent(data)));

  /**
   * side effect for triggering REQUEST_CONTENT on client selection
   * @type {"../../Observable".Observable<R>}
   */
  @Effect() selectClient$ = this._updates$
    .whenAction(SelectClientActions.SELECT_CLIENT)
    .map(({action}) => (this.contentActions.requestContent()));
}