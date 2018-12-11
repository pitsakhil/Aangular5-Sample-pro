import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandoverModalComponent } from './handover-modal.component';

describe('HandoverModalComponent', () => {
  let component: HandoverModalComponent;
  let fixture: ComponentFixture<HandoverModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandoverModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandoverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
