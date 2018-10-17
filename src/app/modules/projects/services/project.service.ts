import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ProjectActions } from '../store/index';
import { ProjectState } from '../models/index';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProjectService {
    private enableHistory = new Subject<any>();
    public enableAdd = true;
    public enableDelete = true;
    currentValue = this.enableHistory.asObservable();
    constructor(private _store: Store<ProjectState>, private _projectActions: ProjectActions) { }

    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     *
     * Function to get current folder data from the store
    */
    public getProjectDocumentData(): Observable<Array<object>> {
        return this._store.select((appState) => {
            return appState.project.projectDocumentsData;
        });
    }

    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     *
     * Function to get navigation bar data from the store
    */
    public getProjectTreeViewData(): Observable<Array<object>> {
        return this._store.select((appState) => {
            return appState.project.treeViewData;
        });
    }

    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     *
     * Function to get current project data from the store
    */
    public getprojectDetails(): Observable<object> {
        return this._store.select((appState) => {
            return appState.project.currentProjectDetail;
        });
    }

    /**
    * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    *
    * Function to get current project data from the store
    */
    public getprojectId(): Observable<number> {
        return this._store.select((appState) => {
            return appState.project.currentProjectId;
        });
    }

    /**
    * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    *
    * Function to get current project data from the store
    */
    public getCurrentPage(): Observable<string> {
        return this._store.select((appState) => {
            return appState.project.currentPage;
        });
    }

    public getDateTime(): Observable<object> {
        return this._store.select((appState) => {
            return appState.project.dateTime;
        });
    }


    public showHistory(value) {
        this.enableHistory.next(value);
    }



}
