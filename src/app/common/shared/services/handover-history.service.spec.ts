import { TestBed, inject } from '@angular/core/testing';

import { HandoverHistoryService } from './handover-history.service';

describe('HandoverHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HandoverHistoryService]
    });
  });

  it('should be created', inject([HandoverHistoryService], (service: HandoverHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
