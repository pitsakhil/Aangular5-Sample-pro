import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { HistoryActions } from './../store/history.actions';
import { HistoryUrls } from './../../../core/constants/config';
import { createAction } from './../store/createAction';
import { ApiService } from './../../../core/services';


@Injectable()
export class HistoryEffects {

    constructor(
        private _actions: Actions,
        private _apiService: ApiService
    ) { }
    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to get history list data from the server
    */
    @Effect()
    history$: Observable<Action> = this._actions
        .ofType(HistoryActions.FETCH_HISTORY_LIST).switchMap((action) => {
            if (!!action['payload'] && `${action['payload']['actions']}` !== '') {
                const sf_id = `${action['payload']['document_id']}`;
                return this._apiService.get(`${HistoryUrls.HISTORY.replace('{sf_id}', sf_id)}?action=${action['payload']['actions']}&start_page=${action['payload']['start_page']}&count=${action['payload']['count']}&sort_by=${action['payload']['sort_by']}&sort_order=${action['payload']['sort_order']}`)
                    .switchMap(result => {
                        result['data']['params'] = action['payload']['params'];
                        return Observable.of({ type: HistoryActions.UPDATE_HISTORY_LIST, payload: { historyListData: result.data } });
                    }).catch(error => {
                        return Observable.of({ type: HistoryActions.UPDATE_HISTORY_LIST, payload: [] });
                    });
            } else {
                return Observable.of({ type: HistoryActions.UPDATE_HISTORY_LIST, payload: [] });
            }
        });
}
