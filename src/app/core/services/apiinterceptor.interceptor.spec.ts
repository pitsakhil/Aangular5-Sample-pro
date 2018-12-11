import { TestBed, inject } from '@angular/core/testing';

import { ApiInterceptorService } from './apiinterceptor.interceptor';
import { CoreModule } from '../core.module';

describe('ApiinterceptorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule],
            providers: [ApiInterceptorService]
        });
    });

    it('should be created', inject([ApiInterceptorService], (service: ApiInterceptorService) => {
        expect(service).toBeTruthy();
    }));
});
