/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InquisiveNotificationComponent } from './inquisive-notification.component';

describe('InquisiveNotificationComponent', () => {
    let component: InquisiveNotificationComponent;
    let fixture: ComponentFixture<InquisiveNotificationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InquisiveNotificationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InquisiveNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //   expect(component).toBeTruthy();
    // });
});
