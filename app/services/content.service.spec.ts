import { provide } from '@angular/core';

import {
  ResponseOptions,
  Response,
  Http,
  BaseRequestOptions,
  RequestMethod
} from '@angular/http';

import {
  inject,
  fakeAsync,
  addProviders
} from '@angular/core/testing';

import { MockBackend, MockConnection } from '@angular/http/testing';

import { ContentService, IAPIContent, BASE_URL } from './content.service';

const mockHttpProvider = {
  deps: [ MockBackend, BaseRequestOptions ],
  useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
    return new Http(backend, defaultOptions);
  }
};

describe('ContentService', () => {
  beforeEach(() => addProviders([
    ContentService,
    MockBackend,
    BaseRequestOptions,
    provide(Http, mockHttpProvider)
  ]));

  it('should use an HTTP call to obtain the content',
    inject(
      [ContentService, MockBackend],
      fakeAsync((service: ContentService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {

          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toBe(BASE_URL);
        });

        service.getContent();
      })
    )
  );

  it('should parse the server response correctly',
    inject(
      [ContentService, MockBackend],
      fakeAsync((service: ContentService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {

          let mockResponseBody: IAPIContent = {
            data: [{title: 'Lukas'}, {title: 'Tim'}],
            total: 2,
            nextOffset: 2
          };

          let response = new ResponseOptions({body: JSON.stringify(mockResponseBody)});
          connection.mockRespond(new Response(response));
        });

        const parsedContent$ = service.getContent()
          .subscribe(data => {
            expect(Array.isArray(data.data)).toBe(true);
            expect(data.data.length).toBeGreaterThan(0);
            expect(data.total).toBeGreaterThan(0);
            expect(data.nextOffset).toBeGreaterThan(0);
          });
      })
    )
  );

});