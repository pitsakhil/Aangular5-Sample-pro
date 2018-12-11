import { AttachmentsModule } from './../../common/attachments/attachments.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule, AgGridColumn } from 'ag-grid-angular/main';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from './../../common/shared/shared.module';
import { routes } from './project.app.routing';

import { ProjectListEffects } from './effects/project-list.effects';
import { projectComponents, projectServices } from './project.include';
import { ProjectComponent } from './project.component';
import { ModuleEngineModule } from '../../common/module_engine/module-engine.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        AgGridModule.withComponents({}),
        TranslateModule,
        EffectsModule.forFeature([ProjectListEffects]),
        SharedModule,
        ModuleEngineModule,
        ReactiveFormsModule,
        AttachmentsModule
    ],
    declarations: [...projectComponents, ProjectComponent],
    providers: [...projectServices]
})
export class ProjectModule { }
