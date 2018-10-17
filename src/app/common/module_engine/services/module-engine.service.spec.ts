import { TestBed, inject } from '@angular/core/testing';

import { ModuleEngineService } from './module-engine.service';

describe('ModuleEngineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModuleEngineService]
    });
  });

  it('should be created', inject([ModuleEngineService], (service: ModuleEngineService) => {
    expect(service).toBeTruthy();
  }));
});
