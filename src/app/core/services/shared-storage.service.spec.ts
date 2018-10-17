import { TestBed, inject } from '@angular/core/testing';

import { SharedStorageService } from './shared-storage.service';

describe('SharedStorageService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SharedStorageService]
        });
    });

    // it('should be created', inject([SharedStorageService], (service: SharedStorageService) => {
    //   expect(service).toBeTruthy();
    // }));
});
