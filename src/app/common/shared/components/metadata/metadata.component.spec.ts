import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataComponent } from './metadata.component';

describe('MetadataComponent', () => {
  let component: MetadataComponent;
  let fixture: ComponentFixture<MetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetadataComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component.body).toBeNull();
  });

  it('should create', () => {
    expect(component.metadataVariables).toBeNull();
  });

  it('should create', () => {
    expect(component.contactId).toBeDefined();
  });

  it('should create', () => {
    const changes = { contactId: { currentValue: '10' } };
    component['ngOnChanges'](changes);
    expect(component.contactId).toEqual(changes.contactId.currentValue);
  });

  it('should create', () => {
    component['ngOnInit']();
    expect(component['_initVariables']()).toHaveBeenCalled();
  });

  it('should create', () => {
    component['_addSubscriptions']();
    expect(component['_onValueChanged']('', '')).toHaveBeenCalled();
  });

  it('should create', () => {
    const data = { 0: { id: 10 } };
    const label = 'status';
    component['_onValueChanged'](data, label);
    expect(component.body[label]).toEqual(data[0].id);
  });

  it('should create', () => {
    component['_prefillValue']();
    expect(component['metadataForm'].controls.priority).toBeDefined();
  });

  it('should create', () => {
    const data = { 0: { id: 10 } };
    const label = 'status';
    component['_onValueChanged'](data, label);
    expect(component.body[label]).toBeDefined();
  });

  it('should create', () => {
    component['ngOnInit']();
    expect(component['_getMetadataDetils']()).toHaveBeenCalled();
  });

  it('should create', () => {
    component['ngOnInit']();
    expect(component['_prefillValue']()).toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    component['_prefillValue']();
    expect(component['metadataForm'].controls.status).toBeDefined();
  });

  it('should create', () => {
    component['_prefillValue']();
    expect(component['metadataForm'].controls.responsible).toBeDefined();
  });

  it('should create', () => {
    const metdata = { documentStatus: 1, documentPriority: 2, documentResponsibleId: 3 };
    component['_setMetaData'](metdata);
    expect(component.body.status).toBe(metdata.documentStatus);
  });

  it('should create', () => {
    component['ngOnInit']();
    expect(component['_addSubscriptions']()).toHaveBeenCalled();
  });

  it('should create', () => {
    const metdata = { documentStatus: 1, documentPriority: 2, documentResponsibleId: 3 };
    component['_setMetaData'](metdata);
    expect(component.body.priority).toBe(metdata.documentPriority);
  });

  it('should create', () => {
    const metdata = { documentStatus: 1, documentPriority: 2, documentResponsibleId: 3 };
    component['_setMetaData'](metdata);
    expect(component.body.responsibleId).toBe(metdata.documentResponsibleId);
  });

  it('should create', () => {
    const metdata = { documentStatus: 1, documentPriority: 2, documentResponsibleId: 3 };
    component['_setMetaData'](metdata);
    expect(component.metadataVariables.created$).toBeDefined();
  });

  it('should create', () => {
    const metdata = { documentStatus: 1, documentPriority: 2, documentResponsibleId: 3 };
    component['_setMetaData'](metdata);
    expect(component.metadataVariables.edited$).toBeDefined();
  });

  it('should create', () => {
    component['triggerActions']();
    expect(component['metadataActions'].fetchStatus({})).toHaveBeenCalled();
  });

  it('should create', () => {
    const metdata = { documentStatus: 1, documentPriority: 2, documentResponsibleId: 3 };
    component['_setMetaData'](metdata);
    expect(component.metadataVariables.documentNumber).toBeDefined();
  });

  it('should create', () => {
    component['triggerActions']();
    expect(component['metadataActions'].fetchUsers({})).toHaveBeenCalled();
  });

  it('should create', () => {
    component['_getStatus']();
    if (!!component.metadataVariables.statusData.length) {
      expect(component['showSelectedStatus']).toBeDefined();
    }
  });

  it('should create', () => {
    component['_getpriority']();
    if (!!component.metadataVariables.statusData.length) {
      expect(component['showSelectedStatus']).toBeDefined();
    }
  });

  it('should create', () => {
    component['triggerActions']();
    expect(component['metadataActions'].fetchPriority({})).toHaveBeenCalled();
  });
});
