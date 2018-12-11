// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ContactDetailsComponent } from './contact-details.component';
// import { ModuleEngineService } from '../../../../../shared_feature_module/module_engine/services/module-engine.service';

// describe('ContactDetailsComponent', () => {
//   let component: ContactDetailsComponent;
//   let fixture: ComponentFixture<ContactDetailsComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ContactDetailsComponent]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ContactDetailsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call _fetchContactDetails', () => {
//     component.ngOnInit();
//     expect(component['_fetchContactDetails()']()).toHaveBeenCalled();
//   });

//   it('should invoke loadContactForm on function call', () => {
//     component['_fetchContactDetails']();
//     expect(component['this.loadContactForm()']()).toHaveBeenCalled();
//   });

//   it('it should call routeActions', () => {
//     component['_fetchContactDetails']();
//     expect(component['this.routeActions()']()).toHaveBeenCalled();
//   });

//   it('action$ shoulb be defined after routeActions() called ', () => {
//     component['routeActions']();
//     expect(component['action']).toBeDefined();
//   });

//   it('string action$ should be null on page init', () => {
//     component.ngOnInit();
//     expect(component['action']).toBeNull();
//   });

//   it('action$ should not be a number', () => {
//     component['routeActions']();
//     expect(component['action']).toBeNaN();
//   });

//   it('if template id is 1, isPersonel should be true else it should be false', () => {
//     if (!!(component.listContactData['templateId'] === 1)) {
//       expect(component['isPersonel']()).toBeTruthy();
//     } else {
//       expect(component['isPersonel']()).toBeFalsy();
//     }
//   });

//   it('after calling loadContactForm, configDataFormated should be defined', () => {
//     component['loadContactForm']();
//     expect(component['configDataFormated']).toBeDefined();
//   });

//   it('loadContactForm should be defined after loadContactForm called', () => {
//     component['loadContactForm']();
//     expect(component['configData']).toBeDefined();
//   });

//   it('it should invoke updateDetailPanelOpen', () => {
//     component['closeView']();
//     expect(component['updateDetailPanelOpen']()).toHaveBeenCalledWith(false);
//   });

//   it('listContactData sould be null after ngOnDestroy', () => {
//     component.ngOnDestroy();
//     expect(component.listContactData).toBeNull();
//   });

//   it('it should call getTemplateData from module engine service', () => {
//     component.loadContactForm();
//     expect(component['moduleEngineService']['getTemplateData'](component['templateId'])).toHaveBeenCalled();
//   });
// });
