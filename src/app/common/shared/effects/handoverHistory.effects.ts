import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HandoverUrls } from '../constants/config';
import { HandoverHistoryActions } from '../store/handoverHistory.action';
import { ApiService } from './../../../core/services';
@Injectable()
export class HandoverHistoryEffects {
    constructor(
        private actions$: Actions,
        private apiService: ApiService
    ) { }

    /**
    * fetch handover history from server and trigger action
    * @author David Raja <david.ra@pitsolutions.com>
    *
    * @param: document_id
    */
    @Effect()
    handoverHistory$: Observable<Action> = this.actions$
        .ofType(HandoverHistoryActions.FETCH_HANDOVER_HISTORY_LIST).switchMap((action) => {
            const sf_id = `${action['payload']['document_id']}`;
            return this.apiService.get(`${HandoverUrls.HANDOVER_HISTORY.replace('{id}', sf_id)}`)
                .switchMap(result => {
                    return Observable.of({ type: HandoverHistoryActions.UPDATE_HANDOVER_HISTORY_LIST, payload: { handoverList: result.data } });
                }).catch(error => {
                    return Observable.of({ type: HandoverHistoryActions.UPDATE_HANDOVER_HISTORY_LIST, payload: [] });
                });
        });
}
