// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Router, RouterModule, ActivatedRoute } from '@angular/router';
// import { TranslateModule } from '@ngx-translate/core';
// import { DocumentModule } from '../../../document.module';
// import { DocumentListGridComponent } from './document-list-grid.component';

// describe('DocumentListGridComponent', () => {
//     let component: DocumentListGridComponent;
//     let fixture: ComponentFixture<DocumentListGridComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 DocumentModule,
//                 TranslateModule.forRoot({})
//             ],
//             providers: [{ provide: Router, useValue: '' }, { provide: ActivatedRoute, useValue: '' }]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(DocumentListGridComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create DocumentListGridComponent', () => {
//         expect(component).toBeTruthy();
//     });

//    fit('should return null if parameter is not passed _gridReadyFunction method', () => {
//         const data = component['_gridReadyFunction'](undefined);
//         expect(data).toBeNull();
//     });

//     it('should return null if parameter is not passed _navigateToNewPage method', () => {
//         const data = component['_navigateToNewPage'](undefined);
//         expect(data).toBeNull();
//     });

//     it('should return null if parameter is not passed _updateTheAgGridWithDataFromStore method', () => {
//         const data = component['_updateTheAgGridWithDataFromStore'](undefined);
//         expect(data).toBeNull();
//     });

//     it('should return null if parameter is not passed _formatData method', () => {
//         const data = component['_formatData'](undefined);
//         expect(data).toBeNull();
//     });
//     it('should return null if parameter is not passed _setStatus method', () => {
//         const data = component['_setStatus'](undefined);
//         expect(data).toBeNull();
//     });

//     it('should return null if parameter is not passed _setPriority method', () => {
//         const data = component['_setPriority'](undefined);
//         expect(data).toBeNull();
//     });

//     it('should return Closed if documentStatus is 3', () => {
//         const data = component['_setStatus']({ documentStatus: 3 });
//         expect(data).toEqual('Closed');
//     });

//     it('should return In-work if documentStatus is 2', () => {
//         const data = component['_setStatus']({ documentStatus: 2 });
//         expect(data).toEqual('In-work');
//     });

//     it('should return Open if documentStatus is 1', () => {
//         const data = component['_setStatus']({ documentStatus: 1 });
//         expect(data).toEqual('Open');
//     });

//     it('should return Normal if documentPriority is 1', () => {
//         const data = component['_setPriority']({ documentPriority: 1 });
//         expect(data).toEqual('Normal');
//     });

//     it('should return High if documentPriority is 2', () => {
//         const data = component['_setPriority']({ documentPriority: 2 });
//         expect(data).toEqual('High');
//     });



// });
