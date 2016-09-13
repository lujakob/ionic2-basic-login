import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";
import {StateUpdates, Effect} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
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

  @Effect() fetchContent$ = this._updates$
    .whenAction(REQUEST_CONTENT)
    .switchMap(() => this._contentService.getContent())
    .map((data) => ({ type: RECEIVE_CONTENT, payload: data}));

  @Effect() selectClient$ = this._updates$
    .whenAction(SELECT_CLIENT)
    .map(({action}) => ({type: REQUEST_CONTENT}));

    // .switchMap(({action}) => (
    //   this._reddit
    //     .fetchPosts(action.payload.reddit)
    //     .map(({data}) => ({ type: RECEIVE_POSTS, payload: {reddit: action.payload.reddit, data}})
    //     )));

  // @Effect() requestPosts$ = this._updates$
  //   .whenAction(SELECT_REDDIT)
  //   .filter(({state, action}) => this.shouldFetchPosts(state.postsByReddit,action.payload))
  //   .map(({action}) => ({type: REQUEST_POSTS, payload: {reddit: action.payload}}));
  //
  // @Effect() fetchPosts$ = this._updates$
  //   .whenAction(REQUEST_POSTS)
  //   .switchMap(({action}) => (
  //     this._reddit
  //       .fetchPosts(action.payload.reddit)
  //       .map(({data}) => ({ type: RECEIVE_POSTS, payload: {reddit: action.payload.reddit, data}})
  //       )));

  // private shouldFetchPosts(postsByReddit, reddit){
  //   const posts = postsByReddit[reddit];
  //   if (!posts) {
  //     return true;
  //   }
  //   if (posts.isFetching) {
  //     return false;
  //   }
  //   return posts.didInvalidate;
  // }
}