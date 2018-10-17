import { TestBed, async, inject } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { ModuleGuard } from './module-guard.guard';
import { CoreModule } from '../core.module';

describe('ModuleGuardGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule],
            providers: [ModuleGuard, { provide: Router, useValue: '/home' }]
        });
    });

    it('should ...', inject([ModuleGuard], (guard: ModuleGuard) => {
        expect(guard).toBeTruthy();
    }));
});