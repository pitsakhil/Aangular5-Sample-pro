import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createAction } from './createAction';
import { ProjectState } from '../models/index';



@Injectable()
export class ProjectActions {

    static FETCH_PROJECTS_DOCUMENT_DATA = 'FETCH_PROJECTS_DOCUMENT_DATA';
    static FETCH_PROJECTS_DETAIL = 'FETCH_PROJECTS_DETAIL';
    static UPDATE_PROJECTS_DOCUMENT_DATA = 'UPDATE_PROJECTS_DOCUMENT_DATA';
    static FETCH_PROJECT_TREEVIEW_DATA = 'FETCH_PROJECT_TREEVIEW_DATA';
    static UPDATE_PROJECT_TREEVIEW = 'UPDATE_PROJECT_TREEVIEW';
    static RESET_PROJECT_TREEVIEW = 'RESET_PROJECT_TREEVIEW';
    static UPDATE_DETAIL_PANEL_OPEN = 'UPDATE_DETAIL_PANEL_OPEN';
    static UPDATE_PROJECT_DETAIL = 'UPDATE_PROJECT_DETAIL';
    static UPDATE_PROJECT_ID = 'UPDATE_PROJECT_ID';
    static DELETE_CURRENT_PROJECT = 'DELETE_CURRENT_PROJECT';
    static HANDLE_ERROR = 'HANDLE_ERROR';
    static UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE';
    static UPDATE_DATE_TIME = 'UPDATE_DATE_TIME'

    constructor(public store: Store<ProjectState>) {

    }

    /**
     * This action will dispatch an action to fetch Project data from server
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public fetchTreeViewData(payload: object): void {
        this.store.dispatch(createAction(ProjectActions.FETCH_PROJECT_TREEVIEW_DATA, payload));
    }

    /**
     * Action  to update the navigation bar(side menu)
     * @param data
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    public updateTreeView(data: Array<object>) {
        this.store.dispatch(createAction(ProjectActions.UPDATE_PROJECT_TREEVIEW, data));
    }

    /**
     * Action  to reset the navigation bar
     * @param data
     * 
     * @author Niphy Anto<niphy.ao@pitsolutions.com>
     */
    public resetTreeView() {
        this.store.dispatch(createAction(ProjectActions.RESET_PROJECT_TREEVIEW));
    }
    /**
    * Action  to update the ag grid rows(mail folders)
    * @param data
    *
    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public updateProjectsData(data:object) {
        this.store.dispatch(createAction(ProjectActions.UPDATE_PROJECTS_DOCUMENT_DATA, data));
    }


    /**
    * Action to fetch ag grid row data

    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public fetchProjectDocumentsData(payload: object): void {
        this.store.dispatch(createAction(ProjectActions.FETCH_PROJECTS_DOCUMENT_DATA, payload));
    }

    /**
    * Action to fetch a project detail

    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public fetchProjectDetail(payload: object): void {
        this.store.dispatch(createAction(ProjectActions.FETCH_PROJECTS_DETAIL, payload));
    }

    /**
    * Action to fetch a project detail

    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public updateProjectDetail(payload: object): void {
        this.store.dispatch(createAction(ProjectActions.UPDATE_PROJECT_DETAIL, payload));
    }


    /**
    * Action to delete a project detail

    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public deleteCurrentProject(payload: object): void {
        this.store.dispatch(createAction(ProjectActions.DELETE_CURRENT_PROJECT, payload));
    }

    /**
    * Action to  update a project id
 
    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public updateCurrentProjectId(payload: object): void {
        this.store.dispatch(createAction(ProjectActions.UPDATE_PROJECT_ID, payload));
    }

    /**
    * Action to  update a project id
 
    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public updateCurrentPage(payload: object): void {
        this.store.dispatch(createAction(ProjectActions.UPDATE_CURRENT_PAGE, payload));
    }


    /**
    * Action to update the date time

    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public updateDateTime(payload: object): void {
        this.store.dispatch(createAction(ProjectActions.UPDATE_DATE_TIME, payload));
    }



}
