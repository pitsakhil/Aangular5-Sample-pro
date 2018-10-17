import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createAction } from './createAction';
import { HistoryState } from '../models/historyState.model';

@Injectable()
export class HistoryActions {
    static FETCH_HISTORY_LIST = 'FETCH_HISTORY_LIST';
    static UPDATE_HISTORY_LIST = 'UPDATE_HISTORY_LIST';
    constructor(public store: Store<HistoryState>) { }
    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to fetch history data from store
    */
    public fetchHistoryData(payload: Object): void {
        this.store.dispatch(createAction(HistoryActions.FETCH_HISTORY_LIST, payload));
    }
    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to update history data to store
    */
    public updateHistoryData(data: Array<Object>) {
        this.store.dispatch(createAction(HistoryActions.UPDATE_HISTORY_LIST, data));
    }
}
