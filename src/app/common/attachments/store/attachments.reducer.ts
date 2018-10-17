import { Action } from '@ngrx/store';

import { Attachments } from './../models';
import { AttachmentsActions } from './attachments.action';

const INITIAL_STATE = {
    RowDataTransaction: {},
    attachmentsList: [],
    attachmentsDetails: [],
    categories: {},
    success_message: []
};
export function AttachmentsReducer(
    attachments: Attachments = INITIAL_STATE,
    action: any
): Attachments {
    switch (action.type) {
        case AttachmentsActions.UPDATE_ROW_DATA:
            return Object.assign({}, attachments, { RowDataTransaction: action.payload });
        case AttachmentsActions.UPDATE_ATTACHMENTS_LIST:
            return Object.assign({}, attachments, { attachmentsList: action.payload });
        case AttachmentsActions.UPDATE_ATTACHMENTS_DETAILS:
            return Object.assign({}, attachments, { attachmentsDetails: action.payload });
        case AttachmentsActions.UPDATE_CATEGORIES:
            return Object.assign({}, attachments, { categories: action.payload });
        case AttachmentsActions.DOWNLOAD_SUCCESS:
            return Object.assign({}, attachments, { success_message: action.payload });
        case AttachmentsActions.RESET_ATTACHMENTS:
            return Object.assign({}, attachments, INITIAL_STATE);
        default:
            return attachments;
    }
}
