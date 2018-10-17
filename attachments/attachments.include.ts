import { AttachmentsTreeGridService, AttachmentsService, FileUploaderService } from './services';
import { FileUploaderComponent, AttachmentsTreeComponent, AttachmentsTreeGridComponent, CategoryEditorComponent } from './components/index';
import { AttachmentsComponent } from './attachments.component';
import { AttachmentsEffects } from './effects';
import { AttachmentsActions } from './store';

export const AttachmentsComponents = [
    AttachmentsComponent,
    FileUploaderComponent,
    AttachmentsTreeComponent,
    AttachmentsTreeGridComponent,
    CategoryEditorComponent
];

export const gridcomponents = [
    CategoryEditorComponent
];

export const AttachmentsServices = [
    AttachmentsService,
    AttachmentsTreeGridService,
    FileUploaderService,
    AttachmentsActions
];

export const attachmentsEffects = [
    AttachmentsEffects
];

