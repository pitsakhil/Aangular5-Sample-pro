import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarToggleComponent } from './navbar-toggle.component';

describe('NavbarToggleComponent', () => {
  let component: NavbarToggleComponent;
  let fixture: ComponentFixture<NavbarToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
