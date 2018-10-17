import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FileQueueObject, FileUploaderService } from '../../services/uploader.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AttachmentsService, AttachmentsTreeGridService } from '../../services';
import { AttachmentsActions } from '../../store';

export function startUpload(data: object, res: object): any {
    uploadData.next(data);
    attachmentSavedData = res;
}

export let uploadData = new BehaviorSubject<object>([]);
export let onTriggerCancel = new BehaviorSubject<object>([]);
let attachmentSavedData: object;


@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {

    @Output() onCompleteItem = new EventEmitter();
    @ViewChild('fileInput') fileInput;
    queue: Observable<FileQueueObject[]>;

    public progress = { upload: 0, count: 0, completed: true, uploadStart: false };
    public files: any;
    public _fileItems: any;
    public isHide: boolean;
    private _subscriptions = new Subscription();

    constructor(
        public uploader: FileUploaderService,
        private _attachmentsService: AttachmentsService,
        private _attachmentsActions: AttachmentsActions,
        private _attachmentsTreeGridService: AttachmentsTreeGridService,
    ) { }

    ngOnInit() {
        this._attachmentsService.progress = this.progress;
        this.queue = this.uploader.queue;
        this.queue.subscribe((res) => {
            (res.length > 0) && (this.progress['uploadStart'] = true);
            this._fileItems = res;
            const length = res.filter((data) => !data.isPending() || !data.inProgress()).length;
            this.progress['count'] = length;
            this.progress['upload'] = length ? Math.round(res.reduce((sum, val) => sum + val['progress'], 0) / length) : 0;
            if (this.progress['uploadStart'] && (this.progress['upload'] === 100 || (length === 0 && this.progress['upload'] === 0))) {
                this._onCompleteAction();
            }
        });
        this.triggerUpload();
    }

    private triggerUpload() {
        uploadData.subscribe(res => {
            this.files = res;
        });
    }

    private _onCompleteAction() {
        const sf_id = this._attachmentsService.sf_id;
        this.progress['uploadStart'] = false;
        this._subscriptions.unsubscribe();
        setTimeout(() => {
            this.uploader.clearQueue();
            this._attachmentsService.allDisable = false;
            this._attachmentsActions.fetchAttachmentsListData({ sf_id: sf_id });
            this.onCompleteItem.emit('completed');
            this._attachmentsService.attachmentSaved.emit(attachmentSavedData);
        }, 800);
    }

    itemCancel(item) {
        if (item.isSuccess()||item.isCancel()) { return; }
        item.cancel();
        onTriggerCancel.next(item);
    }

    public hideDown() {
        this.isHide = !this.isHide;
    }

    allCancel(files) {
        this._subscriptions.add(files.take(1).subscribe(ele => {
            if (!ele) { return }
            ele.forEach(element => {
                this.itemCancel(element);
            });
        }));
    }

    public getIconTemplate(file: object): string {
        if (!file || !file['file_name']) {
            return;
        }
        const iconName = this._attachmentsTreeGridService.getFileIcon(file['file_name'], 2);
        return `<img src="./assets/public/images/extension-icons/${iconName}.svg"/>`;
    }

    doSomethingWithCurrentValue($event) { }

}
