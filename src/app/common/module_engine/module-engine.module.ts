import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModuleEngineService } from '../module_engine/services/module-engine.service';
import { NgSelectModule } from '../ng-select/ng-select.module';
import { SelectModule } from 'ng2-select';
import { moduleEngineComponents, moduleEngineDirectives } from './module-engine.include';
import { MyDatePickerModule } from '../ngx-datepicker';
import { GoogleMapsModule } from 'google-maps-angular2';
import { SharedModule } from './../../common/shared/shared.module';




@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgSelectModule,
        SelectModule,
        MyDatePickerModule,
        SharedModule,
        GoogleMapsModule.forRoot({
            url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyANtV-JxNpNuamK8Nz76xXb0Op5KmU9MTc'
        })
    ],
    declarations: [
        ...moduleEngineDirectives,
        ...moduleEngineComponents
    ],
    exports: [
        ...moduleEngineComponents,
        ...moduleEngineDirectives,
    ],
    entryComponents: [
        ...moduleEngineComponents
    ],
    providers: [
        ModuleEngineService,
    ]
})
export class ModuleEngineModule {
}
