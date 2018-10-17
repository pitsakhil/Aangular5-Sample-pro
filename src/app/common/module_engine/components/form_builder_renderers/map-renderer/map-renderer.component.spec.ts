import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRendererComponentComponent } from './map-renderer.component';

describe('MapRendererComponentComponent', () => {
  let component: MapRendererComponentComponent;
  let fixture: ComponentFixture<MapRendererComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRendererComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRendererComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
