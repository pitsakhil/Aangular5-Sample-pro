import { TestBed, inject } from '@angular/core/testing';

import { QuicknoteService } from './quicknote.service';

describe('QuicknoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuicknoteService]
    });
  });

  it('should be created', inject([QuicknoteService], (service: QuicknoteService) => {
    expect(service).toBeTruthy();
  }));
});
