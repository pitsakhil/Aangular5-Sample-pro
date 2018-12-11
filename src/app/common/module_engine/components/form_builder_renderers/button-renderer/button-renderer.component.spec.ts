import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonRendererComponent } from './button-renderer.component';

describe('ButtonRendererComponent', () => {
  let component: ButtonRendererComponent;
  let fixture: ComponentFixture<ButtonRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});