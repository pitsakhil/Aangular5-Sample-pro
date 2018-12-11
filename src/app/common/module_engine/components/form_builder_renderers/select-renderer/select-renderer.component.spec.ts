import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRendererComponent } from './select-renderer.component';

describe('SelectRendererComponent', () => {
  let component: SelectRendererComponent;
  let fixture: ComponentFixture<SelectRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectRendererComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create change status of togglr field', () => {
    component.moduleEngineService.isToggle = true;
    component.toggleClick();
    expect(component.moduleEngineService.isToggle).toBeFalsy();
  });
});
