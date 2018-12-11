import { TestBed, inject } from '@angular/core/testing';
import { HelperService } from './helper.service';
import { CoreModule } from '../core.module';
import { TranslateModule } from '@ngx-translate/core';

describe('HelperService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [HelperService, TranslateModule.forRoot()]
        });
    });

    // it('should be created', inject([HelperService], (service: HelperService) => {
    //   expect(service).toBeTruthy();
    // }));
});
