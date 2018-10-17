import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EffectsModule } from '@ngrx/effects';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { SharedModule } from './../shared/shared.module';
import { AttachmentsComponents, gridcomponents, AttachmentsServices, attachmentsEffects } from './attachments.include';
import { AttachmentsReducer } from './store';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        RoundProgressModule,
        SharedModule,
        AgGridModule.withComponents(gridcomponents),
        EffectsModule.forFeature(attachmentsEffects),
        StoreModule.forFeature('attachments', AttachmentsReducer)
    ],
    declarations: [...AttachmentsComponents],
    providers: [...AttachmentsServices],
    exports: [...AttachmentsComponents]
})
export class AttachmentsModule { }
