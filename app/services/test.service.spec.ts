import {TestService} from './test.service';
import { addProviders, inject } from "@angular/core/testing";

describe('TestService', () => {

  beforeEach(() => addProviders([TestService]));

  it('should have name property set', inject([TestService], (testService: TestService) =>{
    expect(testService.name).toBe('Injected Service');
  }));

});