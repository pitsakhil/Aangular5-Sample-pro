import {

    LoaderComponent,
    PopupModalComponent,
    ShowhidecontainerComponent,
    SwitchviewComponent,
    AggridHeaderComponent,
    Error404Component,
    Error500Component,
    MetadataComponent,
    AgGridSortingHeaderComponent,
    MapModalComponent,
    CreateMetadataComponent,
    HandoverModalComponent,
    HeaderComponent,
    HeadermenuComponent,
    HeaderrightmenuComponent,
    UserinfoComponent

} from './components';
import { MetadataService } from '../shared/services/metadata.service';
import { HistoryComponent } from './components/history/history.component';
import { HandoverHistoryComponent } from './components/handover-history/handover-history.component'
import { HistoryService } from './services/history.service';
import { QuicknotesComponent } from './components/quicknotes/quicknotes.component';
import { RightBarComponent } from './components/right-bar/right-bar.component';
import { QuicknoteService } from './services/quicknote.service';
import { NavbarToggleComponent } from './components/toggle/navbar-toggle/navbar-toggle.component';
import { NavigationService } from './services/navigation.service';
import { HandoverHistoryService } from './services/handover-history.service';

export const commonComponents = [
    HistoryComponent,
    HandoverHistoryComponent,
    LoaderComponent,
    PopupModalComponent,
    ShowhidecontainerComponent,
    AggridHeaderComponent,
    SwitchviewComponent,
    MetadataComponent,
    AgGridSortingHeaderComponent,
    MapModalComponent,
    CreateMetadataComponent,
    QuicknotesComponent,
    RightBarComponent,
    NavbarToggleComponent,
    HandoverModalComponent,
    HeaderComponent,
    HeadermenuComponent,
    HeaderrightmenuComponent,
    UserinfoComponent
];

export const moduleServices = [
    MetadataService,
    QuicknoteService,
    HandoverHistoryService,
    HistoryService,
    NavigationService
];

export const errorComponents = [
    Error404Component,
    Error500Component,
];



export const entryComponents = [
    AggridHeaderComponent,
    AgGridSortingHeaderComponent,
    HistoryComponent,
    HandoverHistoryComponent
];
