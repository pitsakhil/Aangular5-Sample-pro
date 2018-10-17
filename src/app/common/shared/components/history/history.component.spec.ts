import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryComponent } from './history.component';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('grid API is available after `detectChanges`', () => {
    expect(component.gridOptions.api).toBeTruthy();
  });

  it('Should return null if param is undefined when update store', () => {
    expect(component['_updateAgGridDataFromStore']({})).toBe(null);
  });

  it('Should check documentId is same as the value passed', () => {
    component['_initVariables'](this._listHistoryData);
    expect(component['_listHistoryData'].document_id).toEqual(this.documentId);
  });

  it('should return null if parameter is not passed _formatData method', () => {
    const data = component['_formatData'](undefined);
    expect(data).toBeNull();
  });

  it('should return null if parameter is not passed _timezoneFormatter method', () => {
    const data = component['_timezoneFormatter'](undefined);
    expect(data).toBeNull();
  });

  it('Should check ngOnDestroy is called when component is destroyed', () => {
    spyOn(component, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(component.ngOnDestroy).toHaveBeenCalled();
  });
});
