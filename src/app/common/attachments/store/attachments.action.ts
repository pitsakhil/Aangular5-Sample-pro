import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AttachmentsState } from './../models';
import { createAction } from './createAction';

@Injectable()
export class AttachmentsActions {

    static UPDATE_ROW_DATA = 'UPDATE_ROW_DATA';
    static FETCH_ATTACHMENTS_LIST = 'FETCH_ATTACHMENTS_LIST';
    static UPDATE_ATTACHMENTS_LIST = 'UPDATE_ATTACHMENTS_LIST';
    static FETCH_ATTACHMENTS_DETAILS = 'FETCH_ATTACHMENTS_DETAILS';
    static UPDATE_ATTACHMENTS_DETAILS = 'UPDATE_ATTACHMENTS_DETAILS';
    static FETCH_CATEGORIES = 'FETCH_CATEGORIES';
    static UPDATE_CATEGORIES = 'UPDATE_CATEGORIES';
    static RESET_ATTACHMENTS = 'RESET_ATTACHMENTS';
    static DOWNLOAD_ATTACHMENTS = 'DOWNLOAD_ATTACHMENTS';
    static DOWNLOAD_SUCCESS = 'DOWNLOAD_SUCCESS'

    constructor(private store: Store<AttachmentsState>) { }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Action to update row data
     */
    public updateRowData(payload?: object): void {
        this.store.dispatch(createAction(AttachmentsActions.UPDATE_ROW_DATA, payload));
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Action to fetch private/public attachments list
     */
    public fetchAttachmentsListData(payload?: Object) {
        this.store.dispatch(createAction(AttachmentsActions.FETCH_ATTACHMENTS_LIST, payload));
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Action to fetch private/public attachments list
     */
    public fetchAttachmentsCategories(payload?: Object) {
        this.store.dispatch(createAction(AttachmentsActions.FETCH_CATEGORIES, payload));
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Action to fetch private/public attachments details
     */
    public fetchAttachmentsListDetails(payload?: Object) {
        this.store.dispatch(createAction(AttachmentsActions.FETCH_ATTACHMENTS_DETAILS, payload));
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Action to reset private/public attachments store
     */
    public resetAttachments() {
        this.store.dispatch(createAction(AttachmentsActions.RESET_ATTACHMENTS));
    }

    /**
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    *
    * Action to reset private/public attachments store
    */
    public downloadAttachments(payload?: Object) {
        this.store.dispatch(createAction(AttachmentsActions.DOWNLOAD_ATTACHMENTS, payload));
    }
}
