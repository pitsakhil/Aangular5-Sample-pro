import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchviewComponent } from './switchview.component';

describe('SwitchviewComponent', () => {
    let component: SwitchviewComponent;
    let fixture: ComponentFixture<SwitchviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SwitchviewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SwitchviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
