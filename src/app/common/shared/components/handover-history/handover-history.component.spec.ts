import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandoverHistoryComponent } from './handover-history.component';

describe('HandoverHistoryComponent', () => {
  let component: HandoverHistoryComponent;
  let fixture: ComponentFixture<HandoverHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandoverHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandoverHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
