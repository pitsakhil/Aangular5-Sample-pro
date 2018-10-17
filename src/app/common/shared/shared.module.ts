import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgGridModule, AgGridColumn } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { commonComponents, entryComponents, errorComponents } from './shared.include';
import { NotificationModule } from '../../common/notification/notification.module';

import { MetadataActions } from './store/metadata.actions';
import { MetadataEffects } from './effects/metadata.effects';
import { HistoryEffects } from './effects/history.effects';
import { moduleServices } from './shared.include';
import { MetadataComponent } from './components';
import { HistoryComponent } from './components/history/history.component';
import { HistoryActions } from './store/history.actions';
import { MomentModule } from 'angular2-moment';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { QuicknotesComponent } from './components/quicknotes/quicknotes.component';
import { RightBarComponent } from './components/right-bar/right-bar.component';
import { QuicknoteEffects } from './effects/quicknotes.effects';
import { QuicknoteActions } from './store/quicknote.actions';
import { ScaylaSelectModule } from './../scayla-select';
import { GlobalProfileActions } from './store';

import { MyDatePickerModule } from '../../common/ngx-datepicker';
import { HandoverHistoryComponent } from './components/handover-history/handover-history.component';
import { HandoverHistoryActions } from './store/handoverHistory.action';
import { HandoverHistoryEffects } from './effects/handoverHistory.effects';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ScaylaDatePipe } from './pipes/date.pipe';
@NgModule({
    imports: [
        CommonModule,
        NotificationModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        ScaylaSelectModule,
        AgGridModule.withComponents({}),
        EffectsModule.forFeature([MetadataEffects, HistoryEffects, QuicknoteEffects, HandoverHistoryEffects]),
        StoreModule,
        MomentModule,
        MyDatePickerModule
    ],
    declarations: [
        ...commonComponents,
        ...errorComponents,
        DateFormatPipe,
        SafeHtmlPipe,
        HandoverHistoryComponent,
        ScaylaDatePipe
    ],
    exports: [
        ...commonComponents,
        NotificationModule,
        TranslateModule,
        DateFormatPipe,
        SafeHtmlPipe
    ],
    providers: [
        moduleServices, MetadataActions, HistoryActions, QuicknoteActions, HandoverHistoryActions, GlobalProfileActions
    ],
    entryComponents: [...entryComponents]
})
export class SharedModule { }
