import { TestBed, inject } from '@angular/core/testing';

import { DevmodeLoginService } from './devmode-login.service';

describe('DevmodeLoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DevmodeLoginService]
    });
  });

  it('should be created', inject([DevmodeLoginService], (service: DevmodeLoginService) => {
    expect(service).toBeTruthy();
  }));
});
