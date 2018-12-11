import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelInputRendererComponent } from './label-input-renderer.component';

describe('LabelInputRendererComponent', () => {
  let component: LabelInputRendererComponent;
  let fixture: ComponentFixture<LabelInputRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelInputRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelInputRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
