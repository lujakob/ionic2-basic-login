import { inject, addProviders, fakeAsync } from '@angular/core/testing';
import { ContentActions, ContentActionTypes } from './content.actions';
import { ContentService, IAPIContent } from '../services/content.service';
import { Actions, AppStore } from "angular2-redux";
import { createStore } from 'redux';

import {
  ResponseOptions,
  Response,
  Http,
  BaseRequestOptions,
  RequestMethod
} from '@angular/http';import { provide } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';


let appStoreMock:AppStore;
let contentActions;
let contentService;
let mockBackend;

const createAppStoreMock = () => {
  const appStoreMock:AppStore = new AppStore(createStore(state => state));
  spyOn(appStoreMock, "dispatch");
  return appStoreMock;
};

/**
 * @info: see more information on mocking the appStore for instantiating the ContentActions object in angular2-redux/test/actions.spec.ts
 */
describe('ContentActions', () => {
   beforeEach(() => addProviders([
     ContentService,
     MockBackend,
     BaseRequestOptions,
     provide(Http, {
       useFactory: (backend, options) => new Http(backend, options),
       deps: [MockBackend, BaseRequestOptions]})
   ]));

  beforeEach(inject([MockBackend, ContentService], (_mockBackend, _service) => {
    contentService = _service;
    mockBackend = _mockBackend;

    appStoreMock = <AppStore>createAppStoreMock();
    contentActions = new ContentActions(contentService, appStoreMock);
  }));

  describe('should return the resetNextOffset action', () => {
    it('should reset next offset', () => {
      let actual = contentActions.resetNextOffset();
      let expected = {type: ContentActionTypes.RESET_NEXT_OFFSET };
      expect(actual).toEqual(expected);
    });
  });

  describe('requestContent', () => {

    it('should return the requestContent action', () => {
      let actual = contentActions.requestContent();
      let expected = {type: ContentActionTypes.REQUEST_CONTENT};
      expect(actual).toEqual(expected);
    });
  });

  // it('should return mocked response', done => {
  //
  //   mockBackend.connections.subscribe(connection => {
  //     let mockResponseBody: IAPIContent = {
  //       data: [{title: 'Lukas'}, {title: 'Tim'}],
  //       total: 2,
  //       nextOffset: 2
  //     };
  //
  //     let response = new ResponseOptions({body: JSON.stringify(mockResponseBody)});
  //     connection.mockRespond(new Response(response));
  //   });
  //
  //
  //   const parsedContent$ = contentService.getContent()
  //     .subscribe(data => {
  //       expect(Array.isArray(data.data)).toBe(true);
  //       expect(data.data.length).toBeGreaterThan(0);
  //       expect(data.total).toBeGreaterThan(0);
  //       expect(data.nextOffset).toBeGreaterThan(0);
  //       done();
  //
  //     });
  //
  // });

});