import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {ProjectTreeviewComponent } from './project-treeview.component';

describe('DocumentNavbarComponent', () => {
  let component: ProjectTreeviewComponent;
  let fixture: ComponentFixture<ProjectTreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
