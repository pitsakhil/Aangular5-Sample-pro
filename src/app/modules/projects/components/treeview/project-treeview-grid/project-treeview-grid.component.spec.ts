import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectModule } from '../../../project.module';
import { ProjectNavbarGridComponent } from './project-navbar-grid.component';

describe('ProjectNavbarGridComponent', () => {
    let component: ProjectNavbarGridComponent;
    let fixture: ComponentFixture<ProjectNavbarGridComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ProjectModule],
            providers: [{ provide: Router, useValue: '' }]

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectNavbarGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should return null if parameter is not passed _createProjectNavigationBar method', () => {
        const data = component['_createProjectNavigationBar'](undefined);
        expect(data).toBeNull();
    });

    it('should return null if parameter is not passed to _setRowData method', () => {
        const data = component['_setRowData'](undefined);
        expect(data).toBeNull();
    });

    it('should return null if parameter is not passed to _selectTheActiveMenu', () => {
        const data = component['_selectTheActiveMenu'](undefined);
        expect(data).toBeNull();
    });

    it('should return null if parameter is not passed to _getNodeChildDetails', () => {
        const data = component['_getNodeChildDetails'](undefined);
        expect(data).toBeNull();
    });

    it('should return null if parameter is not passed to __navRowClicked', () => {
        const data = component['_navRowClicked'](undefined);
        expect(data).toBeNull();
    });



    it('should return array of object with module name as title', () => {
        const data = component['_createProjectNavigationBar']({ 1: 'Contact', 2: 'Email' });
        expect(data).toEqual([{ title: 'Contact' }, { title: 'Email' }]);
    });
});
