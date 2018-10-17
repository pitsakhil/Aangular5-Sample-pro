import { Action } from '@ngrx/store';
import { HandoverHistoryActions } from './handoverHistory.action';
import { HandoverHistory, updateHandoverList } from '../models/handoverHistory.model';
/**
 * @author David Raja <david.ra@pitsolutions.com>
 *
 * Function to return history data to store
*/
export function HandoveHistoryReducer(
    handoverHistory: HandoverHistory = { handoverList: {} },
    action: Action
): HandoverHistory {
    switch (action.type) {
        case HandoverHistoryActions.UPDATE_HANDOVER_HISTORY_LIST:
            return updateHandoverList(handoverHistory, action['payload']);
        default:
            return handoverHistory;
    }
}
