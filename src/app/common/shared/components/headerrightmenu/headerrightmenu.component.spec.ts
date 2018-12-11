import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderrightmenuComponent } from './headerrightmenu.component';

describe('HeaderrightmenuComponent', () => {
    let component: HeaderrightmenuComponent;
    let fixture: ComponentFixture<HeaderrightmenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeaderrightmenuComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderrightmenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

});
