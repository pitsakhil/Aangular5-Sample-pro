import { TestBed, async, inject } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { AuthGuard } from './auth-guard.guard';
import { CoreModule } from '../core.module';

describe('AuthGuardGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule],
            providers: [AuthGuard, { provide: Router, useValue: '/home' }]
        });
    });

    it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
        expect(guard).toBeTruthy();
    }));
});
