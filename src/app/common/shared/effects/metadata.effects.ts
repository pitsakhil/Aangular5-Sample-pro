import { MetadataService } from './../services/metadata.service';
import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { MetadataActions } from '../store/index';
import { MetadataUrls } from './../../../core/constants/config';
import { createAction } from '../store/createAction';
import { ApiService } from './../../../core/services';


@Injectable()
export class MetadataEffects {
    private subscriptions = new Subscription();

    constructor(
        private actions$: Actions,
        private apiService: ApiService,
        private metadataService: MetadataService
    ) { }

    /**
 * fetch metadata from server and trigger action to save metadata in store.
 *
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * @param: document_id
 */
    @Effect()
    metadata$: Observable<Action> = this.actions$
        .ofType(MetadataActions.FETCH_METADATA).switchMap((action) =>
            // tslint:disable-next-line:max-line-length
            this.apiService.get(`${MetadataUrls.METADATA.replace('{id}', action['payload']['document_id'])}`)
                .switchMap(result =>
                    Observable.of({ type: MetadataActions.UPDATE_METADATA, payload: { metadataDetails: result.data } })
                ).catch(error => {
                    this.metadataService.resetMetadata(true);
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );


    /**
* fetch status data from serve4 and trigger action to save status in store.
*
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
*/
    @Effect()
    status$: Observable<Action> = this.actions$
        .ofType(MetadataActions.FETCH_STATUS).switchMap((action) =>
            // tslint:disable-next-line:max-line-length
            this.apiService.get(`${MetadataUrls.STATUS}`)
                .switchMap(result =>
                    Observable.of({ type: MetadataActions.UPDATE_STATUS, payload: { statusDetails: result.data } })
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );

    /**
* fetch priority from server and trigger action to save priority in store.
*
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
*/
    @Effect()
    priority$: Observable<Action> = this.actions$
        .ofType(MetadataActions.FETCH_PRIORITY).switchMap((action) =>
            // tslint:disable-next-line:max-line-length
            this.apiService.get(`${MetadataUrls.PRIORITY}`)
                .switchMap(result =>
                    Observable.of({ type: MetadataActions.UPDATE_PRIORITY, payload: { priorityDetails: result.data } })
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );

    /**
* fetch user data from serve and trigger action to save user datas in store.
*
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
*/
    @Effect()
    users$: Observable<Action> = this.actions$
        .ofType(MetadataActions.FETCH_USERS).switchMap((action) =>
            // tslint:disable-next-line:max-line-length
            this.apiService.get(MetadataUrls.USERS.replace('{folderId}', `${action['payload']['folder_id']}`) + `${action['payload']['module_id']}`)
                .switchMap(result =>
                    Observable.of({ type: MetadataActions.UPDATE_USERS, payload: { usersDetails: result.data } })
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );

    /**
* fetch delegate to details from server to save user datas in store.
*
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
*/
    @Effect()
    delegate$: Observable<Action> = this.actions$
        .ofType(MetadataActions.FETCH_DELEGATE_TO).switchMap((action) =>
            this.apiService.get(`${MetadataUrls.DELEGATE_TO}${action['payload']['module_id']}`)
                .switchMap(result =>
                    Observable.of({ type: MetadataActions.UPDATE_DELEGATE_TO, payload: { delegateDetails: result.data } })
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );

    /**
* fetch document permission from server to save user datas in store.
*
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
*/
    @Effect()
    documentPermission$: Observable<Action> = this.actions$
        .ofType(MetadataActions.FETCH_DOCUMENT_PERMISSION).switchMap((action) =>
            this.apiService.get(`${MetadataUrls.DOCUMENT_PERMISSION}`)
                .switchMap(result =>
                    Observable.of({ type: MetadataActions.UPDATE_DOCUMENT_PERMISSION, payload: { permissionDetails: result.data } })
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );

    /**
* fetch projects from server to saves in store.
*
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
*/
    @Effect()
    project$: Observable<Action> = this.actions$
        .ofType(MetadataActions.FETCH_PROJECTS).switchMap((action) =>
            this.apiService.get(`${MetadataUrls.PROJECTS}`)
                .switchMap(result =>
                    Observable.of({ type: MetadataActions.UPDATE_PROJECTS, payload: { projectDetails: result.data.list } })
                )
                // .tap(value => { console.log('value', value); }
                // )
                .catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );


}
