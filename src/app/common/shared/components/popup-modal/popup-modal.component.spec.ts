import { Http } from '@angular/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PopupModalComponent } from './popup-modal.component';

describe('PopupModalComponent', () => {
    let component: PopupModalComponent;
    let fixture: ComponentFixture<PopupModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PopupModalComponent],
            imports: [
                TranslateModule.forRoot()
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PopupModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
