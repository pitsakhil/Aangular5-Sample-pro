import { TestBed, inject } from '@angular/core/testing';

import { AttachmentsTreeGridService } from './attachments-tree-grid.service';

describe('AttachmentsTreeGridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttachmentsTreeGridService]
    });
  });

  it('should be created', inject([AttachmentsTreeGridService], (service: AttachmentsTreeGridService) => {
    expect(service).toBeTruthy();
  }));
});
