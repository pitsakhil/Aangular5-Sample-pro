import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';

import { AttachmentsActions } from './store';
import { AttachmentsService } from './services';

@Component({
    selector: 'app-attachments',
    templateUrl: './attachments.component.html',
    styleUrls: ['./attachments.component.scss']
})

export class AttachmentsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() sf_id: string;
    @Output() attachmentSaved = new EventEmitter<any>();
    public attachmentsLoad: boolean = false;

    constructor(
        private _attachmentService: AttachmentsService,
        private _attachmentActions: AttachmentsActions
    ) { }

    ngOnInit() {
        this._attachmentActions.fetchAttachmentsCategories();
        this._attachmentService.attachmentSaved = this.attachmentSaved;
        setTimeout(() => { this.attachmentsLoad = true; });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.sf_id && !!this.sf_id) {
            this._attachmentService.editCancel = false;
            this._attachmentService.editClick = false;
            this._attachmentService.sf_id = this.sf_id;
            this._attachmentService.attachmentsInValid = false;
            this._attachmentService.attachmentsOnChange = false;
            this._attachmentActions.fetchAttachmentsListData({ sf_id: this.sf_id });
        }
    }

    ngOnDestroy() {
        this._attachmentService.sf_id = null;
    }

}
