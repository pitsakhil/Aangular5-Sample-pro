import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteRendererComponent } from './auto-complete-renderer.component';

describe('AutoCompleteRendererComponent', () => {
  let component: AutoCompleteRendererComponent;
  let fixture: ComponentFixture<AutoCompleteRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCompleteRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
