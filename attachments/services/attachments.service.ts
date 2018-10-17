import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridOptions } from 'ag-grid';

import { Observable } from 'rxjs/Observable';

import { AttachmentsState } from './../models';

@Injectable()
export class AttachmentsService {
    public progress: object;
    public attachmentTreeGridOptions: GridOptions;
    public sf_id: string;
    public editClick: boolean;
    public saveClick: boolean;
    public editCancel: boolean;
    public editNodeData: object;
    public addDisable: boolean;
    public allDisable: boolean;
    public popUpTitle: string;
    public nameAfterEdit: string;
    public attachmentSaved: any;
    public attachmentsInValid: boolean;
    public attachmentsOnChange: boolean;
    public permissions: object = { 1: true, 2: true, 3: true, 4: true };
    public permissions_new: object = { 1: true, 2: true, 3: true, 4: true };

    constructor(private _store: Store<AttachmentsState>) { }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to listen row data update
     */
    onUpdateRowData(): Observable<object> {
        return this._store.select(appState => appState.attachments.RowDataTransaction);
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to get attachments list from the store
     */
    getAttachmentsList(): Observable<object> {
        return this._store.select(appState => appState.attachments.attachmentsList);
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to get attachments list from the store
     */
    getCategoriesList(): Observable<object> {
        return this._store.select(appState => appState.attachments.categories);
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to get attachments list from the store
     */
    getAttachmentsDetails(): Observable<object> {
        return this._store.select(appState => appState.attachments.attachmentsDetails);
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to set grid cells editable or not
     */
    setGridEditable(flag?: boolean) {
        this.addDisable = flag;
        const gridOption = this.attachmentTreeGridOptions;
        if (!flag && gridOption && gridOption['api']) {
            gridOption['api'].refreshCells({ force: true });
        }
    }

}
