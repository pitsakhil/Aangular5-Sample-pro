import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AttachmentsActions } from './../../store';
import { AttachmentsService } from './../../services';
import { IconTypes, ClickActions } from './../../constants';
import { MetadataService } from './../../../shared/services/metadata.service';

import { skip } from 'rxjs/operators';
import { downloadAttachment } from './attachments-tree-grid/attachments-tree-grid.component';
@Component({
    selector: 'app-attachments-tree',
    templateUrl: './attachments-tree.component.html',
    styleUrls: ['./attachments-tree.component.scss']
})
export class AttachmentsTreeComponent implements OnInit, OnDestroy {
    @ViewChild('selectFile') selectFile;

    private _subscriptions = new Subscription();

    constructor(
        private _attachmentsActions: AttachmentsActions,
        private _metadataService: MetadataService,
        public attachmentsService: AttachmentsService,
    ) { }

    ngOnInit() {
        this._checkPermission();
    }

    public addRecord(type_id?: number, fileInput?: any): void {
        this._attachmentsActions.updateRowData({ action: ClickActions.ADD, type_id: type_id, fileInput: this.selectFile });
    }

    public isIconDisabled(iconType?: string): any {
        const gridOption = this.attachmentsService.attachmentTreeGridOptions;
        if (!gridOption || !gridOption['api']) {
            return true;
        }
        const selectedNodes = gridOption['api'].getSelectedNodes();
        const editActive = !!gridOption['api'].getEditingCells().length || !!this.attachmentsService.editClick;
        switch (iconType) {
            case IconTypes.CREATE:
                return (!!selectedNodes.length && selectedNodes[0]['data']['type_id'] === 2);
            case IconTypes.ADD:
                return !!this.attachmentsService.allDisable || !this.attachmentsService.permissions_new['4'] || selectedNodes.length > 1 || !!this.attachmentsService.addDisable;
            case IconTypes.EDIT:
                return !!this.attachmentsService.allDisable || !!this.attachmentsService.addDisable || !this.attachmentsService.permissions_new['2'] || selectedNodes.length !== 1;
            case IconTypes.DELETE:
                return !!this.attachmentsService.allDisable || !this.attachmentsService.permissions_new['3'] || selectedNodes.length === 0;
            case IconTypes.DOWNLOAD:
                return editActive || !!this.attachmentsService.allDisable || selectedNodes.length === 0 || downloadAttachment(selectedNodes).length < 1;
            default:
                return false;
        }
    }

    public onIconClicked(type?: string): any {
        switch (type) {
            case IconTypes.EDIT:
                const gridOption = this.attachmentsService.attachmentTreeGridOptions;
                const selectedNodes = gridOption['api'].getSelectedNodes();
                this.attachmentsService.editNodeData = selectedNodes[0]['data'];
                return this.attachmentsService.editClick = true;
            case IconTypes.CLOSE:
                this.attachmentsService.editCancel = true;
                return this._updateRowNodes();
            case IconTypes.EXTENSION_VALID:
                return this._updateExtension();
            case IconTypes.UPDATE:
                return this._updateRowNodes();
            case IconTypes.DELETE:
                return this._deleteRowNodes();
            case IconTypes.DOWNLOAD:
                return this._downloadRowNodes();
        }
    }

    public isConfirm(type?: string, popUpElement?: HTMLElement): void {
        this.attachmentsService.popUpTitle = `attachments${type}`;
        popUpElement.click();
    }

    public handleConfirm(result): any {
        const type = this.attachmentsService.popUpTitle.replace('attachments', '');
        if (!!result) {
            return this.onIconClicked(type);
        } else if (type === IconTypes.EXTENSION_VALID) {
            this.attachmentsService.nameAfterEdit = null;
        }
        return null;
    }

    private _checkPermission(): void {
        this._subscriptions.add(
            this._metadataService.getUserPermissionDetails().pipe(skip(1)).subscribe((res) => {
                if (!!res) {
                    this.attachmentsService.permissions = res;
                    this.attachmentsService.permissions_new = res;
                }
            })
        );
    }

    private _deleteRowNodes(): void {
        this._attachmentsActions.updateRowData({ action: ClickActions.DELETE });
    }

    private _downloadRowNodes(): void {
        this._attachmentsActions.updateRowData({ action: ClickActions.DOWNLOAD });
    }

    private _updateRowNodes(): void {
        const gridOption = this.attachmentsService.attachmentTreeGridOptions;
        const editingCells = gridOption['api'].getEditingCells();
        const checkNameUnderEdit = editingCells.length ? editingCells[0].column.getColId() === 'ag-Grid-AutoColumn' : false;
        if(!!checkNameUnderEdit) {
            gridOption['api'].stopEditing();
        }
        setTimeout(()=>{
            this.attachmentsService.saveClick = true;
            this.attachmentsService.editClick = false;
            this._attachmentsActions.updateRowData({ action: ClickActions.UPDATE });
        });
    }

    private _updateExtension() {
        this._attachmentsActions.updateRowData({ action: ClickActions.EXTENSION_CONFIRM });
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
    }
}
