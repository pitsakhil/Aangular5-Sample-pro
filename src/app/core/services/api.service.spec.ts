import { TestBed, inject } from '@angular/core/testing';

import { ApiService } from './api.service';
import { CoreModule } from '../core.module';

describe('ApiService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule],
            providers: [ApiService]
        });
    });

    it('should be created', inject([ApiService], (service: ApiService) => {
        expect(service).toBeTruthy();
    }));
});
