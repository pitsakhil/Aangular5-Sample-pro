import { Action } from '@ngrx/store';
import { HistoryActions } from './history.actions';
import { History, updateHistoryList } from '../models/history.model';
import { HistoryService } from '../services/history.service';
/**
 * @author David Raja <david.ra@pitsolutions.com>
 *
 * Function to return history data to store
*/
export function HistoryReducer(
    history: History = { historyListData: [] },
    action: Action
): History {
    switch (action.type) {
        case HistoryActions.UPDATE_HISTORY_LIST:
            return updateHistoryList(history, action['payload']);
        default:
            return history;
    }
}
