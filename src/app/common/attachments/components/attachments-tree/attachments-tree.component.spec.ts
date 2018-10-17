import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsTreeComponent } from './attachments-tree.component';

describe('AttachmentsTreeComponent', () => {
  let component: AttachmentsTreeComponent;
  let fixture: ComponentFixture<AttachmentsTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
