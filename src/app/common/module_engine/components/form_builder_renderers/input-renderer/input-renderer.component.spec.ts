import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputRendererComponent } from './input-renderer.component';

describe('InputRendererComponent', () => {
  let component: InputRendererComponent;
  let fixture: ComponentFixture<InputRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
