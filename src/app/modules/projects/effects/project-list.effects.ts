/**
 * @author Vijayan PP<vijayan.pp@pitsolutions.com>
 * 
 * This ProjectListEffects will handle the Side Effects in the Project Module
*/

import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services';
import { ProjectActions } from '../store/index';
import { createAction } from '../../../core/store/createAction';
import { SpinnerActions } from '../../../core/store/index';

import { ProjectUrls, DocumentUrls } from '../../../core/constants/config';
import { NotificationService } from '../../../common/notification/services/notification.service';


@Injectable()
export class ProjectListEffects {
    private _subscriptions = new Subscription();

    constructor(
        private _actions$: Actions,
        private _apiService: ApiService,
        private _spinnerActions: SpinnerActions,
        private _projectActions: ProjectActions,
        private _notification: NotificationService
    ) { }

    @Effect()

    protected navBarData$: Observable<Action> = this._actions$
        .ofType(ProjectActions.FETCH_PROJECT_TREEVIEW_DATA).switchMap((action) =>
            this._apiService.get(`${ProjectUrls.PROJECT_STRUCTURE}?module=${action['payload']['moduleId']}`)
                .switchMap(result => {
                    return Observable.of({ type: ProjectActions.UPDATE_PROJECT_TREEVIEW, payload: { treeViewData: result.data } });
                }

                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );

    @Effect()
    protected ProjectData$: Observable<Action> = this._actions$
        .ofType(ProjectActions.FETCH_PROJECTS_DOCUMENT_DATA).switchMap((action) =>
            // tslint:disable-next-line:max-line-length
            this._apiService.get(`${DocumentUrls.DOCUMENT_LIST}?sort_order=${action['payload']['sort_order']}&sort_by=${action['payload']['sort_by']}&start_page=${action['payload']['start_page']}&count=${action['payload']['count']}&project_id=${action['payload']['project_id']}`)
                .switchMap((result) => {
                    result['data']['params'] = action['payload']['params'];
                    if (result['data']['list']) {
                        return Observable.of({ type: ProjectActions.UPDATE_PROJECTS_DOCUMENT_DATA, payload: { projectDocumentsData: result.data } });
                    } else {
                        this._notification.error('error', result['message']);
                    }
                }).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );

    @Effect()
    protected ProjectDetail$: Observable<Action> = this._actions$
        .ofType(ProjectActions.FETCH_PROJECTS_DETAIL).switchMap((action) =>
            // tslint:disable-next-line:max-line-length
            this._apiService.get(`${ProjectUrls.PROJECT_LIST}/${action['payload']['project_id']}`)
                .switchMap((result) => {
                    if (result['data']) {
                        return Observable.of({ type: ProjectActions.UPDATE_PROJECT_DETAIL, payload: { currentProjectDetail: result.data } });
                    } else {
                        this._notification.error('error', result['message']);
                    }
                }).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );

    @Effect()
    protected ProjectDelete$: Observable<Action> = this._actions$
        .ofType(ProjectActions.DELETE_CURRENT_PROJECT).switchMap((action) =>
            // tslint:disable-next-line:max-line-length
            this._apiService.delete(`${ProjectUrls.PROJECT_LIST}/${action['payload']['project_id']}`)
                .switchMap((result) => {
                    this._notification.success('success', result['message']);                   
                    this._projectActions.updateCurrentProjectId({ currentProjectId: 0 });
                    this._projectActions.fetchProjectDetail({ project_id: 0 });
                    this._projectActions.updateProjectsData({ projectDocumentsData: {params:{},total_results:0}})
                    return Observable.of({ type: ProjectActions.FETCH_PROJECT_TREEVIEW_DATA, payload: { moduleId: 1 } });


                }).catch(error => {
                    this._notification.error('error', error['error']['message']);
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );

}


