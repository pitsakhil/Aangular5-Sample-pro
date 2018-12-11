import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { QuickNoteUrls, UserSettingsUrls } from './../../../core/constants/config';
import { QuicknoteActions } from '../store/quicknote.actions';
import { ApiService } from './../../../core/services';
import { GlobalProfileActions } from '../store/user-profile/global.profile.action';

@Injectable()
export class QuicknoteEffects {
    private subscriptions = new Subscription();

    constructor(
        private actions$: Actions,
        private apiService: ApiService
    ) { }

    /**
    * fetch quicknotes from server and trigger action to update quicknotes in store.
    *
    * @author David Raja <david.ra@pitsolutions.com>
    *
    * @param: document_id
    */
    @Effect()
    quicknotes$: Observable<Action> = this.actions$
        .ofType(QuicknoteActions.FETCH_QUICKNOTES_LIST).switchMap((action) => {
            const sf_id = `${action['payload']['document_id']}`;
            return this.apiService.get(`${QuickNoteUrls.QUICKNOTE.replace('{sf_id}', sf_id)}`)
                .switchMap(result =>
                    Observable.of({ type: QuicknoteActions.UPDATE_QUICKNOTES_LIST, payload: { quicknotesList: result.data } })
                ).catch(error =>
                    Observable.of({ type: QuicknoteActions.UPDATE_QUICKNOTES_LIST, payload: { quicknotesList: [] } })
                );
        });
    /**
    * add quicknotes from server and trigger action to update quicknotes in store.
    *
    * @author David Raja <david.ra@pitsolutions.com>
    *
    * @param: type_id
    * @param: body
    */
    @Effect()
    addQuicknotes$: Observable<Action> = this.actions$
        .ofType(QuicknoteActions.FETCH_CREATE_QUICKNOTE).switchMap((action) => {
            const sf_id = `${action['payload']['document_id']}`;
            return this.apiService.post(`${QuickNoteUrls.QUICKNOTE.replace('{sf_id}', sf_id)}`, `${action['payload']['body']}`)
                .switchMap(result =>
                    Observable.of({ type: QuicknoteActions.UPDATE_CREATE_QUICKNOTE, payload: { quicknote: result } })
                ).catch(error =>
                    Observable.of({ type: 'FAIL', payload: error })
                );
        });
    /**
    * add quicknotes from server and trigger action to update quicknotes in store.
    *
    * @author David Raja <david.ra@pitsolutions.com>
    *
    * @param: quicknote_id
    * @param: body
    */
    @Effect()
    saveQuicknotes$: Observable<Action> = this.actions$
        .ofType(QuicknoteActions.FETCH_EDIT_QUICKNOTE).switchMap((action) => {
            const sf_id = `${action['payload']['document_id']}`;
            return this.apiService.put(`${QuickNoteUrls.QUICKNOTE.replace('{sf_id}', sf_id)}/` + `${action['payload']['quicknote_id']}`, `${action['payload']['body']}`)
                .switchMap(result =>
                    Observable.of({ type: QuicknoteActions.UPDATE_EDIT_QUICKNOTE, payload: { quicknote: result } })
                ).catch(error =>
                    Observable.of({ type: 'FAIL', payload: error })
                );
        });
    /**
    * delete quicknotes from server and trigger action to update quicknotes in store.
    *
    * @author David Raja <david.ra@pitsolutions.com>
    *
    * @param: document_id
    * @param: quicknote_id
    */
    @Effect()
    deleteQuickNote$: Observable<Action> = this.actions$
        .ofType(QuicknoteActions.INITIATE_DELETE_QUICKNOTE).switchMap((action) => {
            const sf_id = `${action['payload']['document_id']}`;
            return this.apiService.delete(`${QuickNoteUrls.QUICKNOTE.replace('{sf_id}', sf_id)}/` + `${action['payload']['quicknote_id']}`)
                .switchMap(result =>
                    Observable.of({ type: QuicknoteActions.UPDATE_DELETE_QUICKNOTE, payload: { quicknote: result } })
                ).catch(error =>
                    Observable.of({ type: 'FAIL', payload: error })
                );
        });

    @Effect()
    protected fetchglobalprofile: Observable<Action> = this.actions$
        .ofType(GlobalProfileActions.FETCH_GLOBAL_PROFILE_DETAILS)
        .map(toPayload).switchMap((userId) =>
            this.apiService.get('/' + UserSettingsUrls.GET_GLOBAL_PROFILE, 'AUTH')
                .switchMap(result =>
                    Observable.of({ type: GlobalProfileActions.UPDATE_GLOBAL_PROFILE_DETAILS, payload: { userdata: result.data } })
                )
        );
}
