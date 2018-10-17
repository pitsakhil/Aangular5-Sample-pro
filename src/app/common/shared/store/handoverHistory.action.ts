import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createAction } from './createAction';
import { HandoverHistoryState } from '../models/handoverHistoryState.model';

@Injectable()
export class HandoverHistoryActions {
    static FETCH_HANDOVER_HISTORY_LIST = 'FETCH_HANDOVER_HISTORY_LIST';
    static UPDATE_HANDOVER_HISTORY_LIST = 'UPDATE_HANDOVER_HISTORY_LIST';
    constructor(public store: Store<HandoverHistoryState>) { }
    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to fetch history data from store
    */
    public fetchHistoryData(payload: Object): void {
        this.store.dispatch(createAction(HandoverHistoryActions.FETCH_HANDOVER_HISTORY_LIST, payload));
    }
    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to update history data to store
    */
    public updateHistoryData(payload: Object) {
        this.store.dispatch(createAction(HandoverHistoryActions.UPDATE_HANDOVER_HISTORY_LIST, payload));
    }
}
