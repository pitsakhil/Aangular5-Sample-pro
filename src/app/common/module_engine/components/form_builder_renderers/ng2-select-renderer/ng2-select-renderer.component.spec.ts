import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ng2SelectRendererComponent } from './ng2-select-renderer.component';

describe('Ng2SelectRendererComponent', () => {
  let component: Ng2SelectRendererComponent;
  let fixture: ComponentFixture<Ng2SelectRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ng2SelectRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ng2SelectRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
