import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// import all rxjs operators that are needed
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';

// import store state interface
import { AttachmentsActions } from '../store/index';

// import all api calls
import { ApiService } from './../../../core/services';
import { AttachmentUrls } from './../constants/attachments';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AttachmentsEffects {
    constructor(
        private actions$: Actions,
        private apiService: ApiService,
        private attachmentsActions: AttachmentsActions,
    ) { }

    /**
     * Effects to fetch public/private attachments list
     * @author Akhil K <akhil.kn@pitsolutions.com>
     */
    @Effect()
    protected fetchAttachmentsList: Observable<Action> = this.actions$
        .ofType(AttachmentsActions.FETCH_ATTACHMENTS_LIST)
        .map(toPayload).switchMap((res) => {
            const API_URL = AttachmentUrls.ATTACHMENTS_MAIN_URL.replace('{sf_id}', res['sf_id']);
            return this.apiService
                .get(`${API_URL}`)
                .switchMap(result => {
                    const data = { attachmentsList: result.data, payload: res };
                    return Observable.of({ type: AttachmentsActions.UPDATE_ATTACHMENTS_LIST, payload: data });
                }).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                });
        });

    /**
     * Effects to fetch public/private attachments details
     *
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */
    @Effect()
    protected fetchCategories: Observable<Action> = this.actions$
        .ofType(AttachmentsActions.FETCH_CATEGORIES)
        .map(toPayload).switchMap((res) => {
            return forkJoin([this.apiService.get(`${AttachmentUrls.PUBLIC_CATEGORY}`), this.apiService.get(`${AttachmentUrls.PRIVATE_CATEGORY}`)])
                .switchMap(result => {
                    const payload = {
                        'public_categories': result[0]['data'],
                        'private_categories': result[1]['data']
                    };
                    return Observable.of({ type: AttachmentsActions.UPDATE_CATEGORIES, payload: payload });
                }).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                });
        });


    /**
    * Effects to fetch public/private attachments details
    *
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    */
    @Effect()
    protected downloadAttachments: Observable<Action> = this.actions$
        .ofType(AttachmentsActions.DOWNLOAD_ATTACHMENTS)
        .map(toPayload).switchMap((res) => {
            if (!res.length) {
                return;
            }
            const attachment_ids = Array.from(new Set(res.map(el => el.id))).toString()
            return this.apiService.get(`${AttachmentUrls.DOWNLOAD_ATTACHMENTS.replace('{sf_id}', res[0].sf_id).replace('{attachment_ids}', attachment_ids)}`)
                .switchMap(result => {
                    const files = result['data']['files'];
                    (!!result['data']) && files.forEach(element => {
                        setTimeout(() => {
                            window.open(environment.API_URL + AttachmentUrls.FORCE_DOWNLOAD.replace('{file_name}', element), '_blank');
                        }, 500);
                    });

                    return Observable.of({ type: AttachmentsActions.DOWNLOAD_SUCCESS, payload: result });
                }).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                });
        });
}