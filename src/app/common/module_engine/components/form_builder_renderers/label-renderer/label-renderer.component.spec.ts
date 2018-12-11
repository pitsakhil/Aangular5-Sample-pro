import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelRendererComponent } from './label-renderer.component';

describe('LabelRendererComponent', () => {
  let component: LabelRendererComponent;
  let fixture: ComponentFixture<LabelRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
