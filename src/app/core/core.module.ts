import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { SelectModule } from 'ng2-select';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ApiInterceptorService } from './../core/services';
import { coreComponents, coreServices, authServices, actionServices } from './core.include';
import { SharedModule } from './../common/shared/shared.module';
import { Permission, UserToken } from './models/permission.model';
import { rootReducer } from './store/rootReducer';
import { CoreModuleEffects } from './effects/coremodule.effects';




@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        SharedModule,
        StoreModule.forRoot(rootReducer),
        EffectsModule.forRoot([CoreModuleEffects]),
        NgIdleKeepaliveModule.forRoot()
    ],
    declarations: [...coreComponents],
    exports: [
        ...coreComponents,
        SelectModule
    ],
    providers: [
        ...coreServices,
        ...authServices,
        JwtHelper,
        Permission,
        UserToken,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptorService,
            multi: true
        },
        ...actionServices

    ]
})
export class CoreModule { }
