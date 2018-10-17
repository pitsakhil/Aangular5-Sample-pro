import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowhidecontainerComponent } from './showhidecontainer.component';

describe('ShowhidecontainerComponent', () => {
    let component: ShowhidecontainerComponent;
    let fixture: ComponentFixture<ShowhidecontainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShowhidecontainerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShowhidecontainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //   expect(component).toBeTruthy();
    // });
});
