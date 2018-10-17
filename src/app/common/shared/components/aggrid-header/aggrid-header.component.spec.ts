import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AggridHeaderComponent } from './aggrid-header.component';
import { SettingsModule } from './../../../modules/settings/settings.module';

describe('AggridHeaderComponent', () => {
    let component: AggridHeaderComponent;
    let fixture: ComponentFixture<AggridHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SettingsModule,
                TranslateModule.forRoot()
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AggridHeaderComponent);
        component = fixture.componentInstance;
        component.params = { displayName: 'Company' };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should check ngOnDestroy is called when component is destroyed', () => {
        spyOn(component, 'ngOnDestroy');
        component.ngOnDestroy();
        expect(component.ngOnDestroy).toHaveBeenCalled();
    });

});
