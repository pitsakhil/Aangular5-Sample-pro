import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsTreeGridComponent } from './attachments-tree-grid.component';

describe('AttachmentsTreeGridComponent', () => {
  let component: AttachmentsTreeGridComponent;
  let fixture: ComponentFixture<AttachmentsTreeGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsTreeGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsTreeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
