import { Action } from '@ngrx/store';
import { QuicknoteActions } from './quicknote.actions';
import {
    updateQuicknotesList,
    updateAddQuicknote,
    updateSaveQuicknote,
    updateDeleteQuicknote,
    Quicknotes

} from '../models/quicknotes.model';

export function QuicknoteReducer(
    quicknotes: Quicknotes = { quicknotesList: {}, quicknote: {}, saveQuicknote: {}, deleteQuickNote: {} },
    action: Action
): Quicknotes {
    switch (action.type) {
        case QuicknoteActions.UPDATE_QUICKNOTES_LIST:
            return updateQuicknotesList(quicknotes, action['payload']);
        case QuicknoteActions.UPDATE_CREATE_QUICKNOTE:
            return updateAddQuicknote(quicknotes, action['payload']);
        case QuicknoteActions.UPDATE_EDIT_QUICKNOTE:
            return updateSaveQuicknote(quicknotes, action['payload']);
        case QuicknoteActions.UPDATE_DELETE_QUICKNOTE:
            return updateDeleteQuicknote(quicknotes, action['payload']);
        default:
            return quicknotes;
    }
}
