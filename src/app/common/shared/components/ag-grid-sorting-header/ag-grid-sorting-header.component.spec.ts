import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridSortingHeaderComponent } from './ag-grid-sorting-header.component';

describe('AgGridSortingHeaderComponent', () => {
  let component: AgGridSortingHeaderComponent;
  let fixture: ComponentFixture<AgGridSortingHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridSortingHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridSortingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
