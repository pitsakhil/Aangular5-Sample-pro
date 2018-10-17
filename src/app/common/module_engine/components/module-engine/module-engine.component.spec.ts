import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleEngineComponent } from './module-engine.component';

describe('ModuleEngineComponent', () => {
  let component: ModuleEngineComponent;
  let fixture: ComponentFixture<ModuleEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
