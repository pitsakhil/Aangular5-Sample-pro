import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GridOptions } from 'ag-grid';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { MetadataState } from '../models/metadataState.model';
import { MetadataActions } from '../store/metadata.actions';
import { MetadataUrls } from './../../../core/constants/config';

@Injectable()
export class MetadataService {
    public hideContactPanelOptions = new Subject<{ navBar?: Boolean, tableBar?: Boolean }>();
    public subscriptions: Subscription;
    public listGridOption: GridOptions;
    public sourceLink = new BehaviorSubject<any>('/contacts');
    link = this.sourceLink.asObservable();
    private metadataPayload = new Subject<any>();
    currentPayload = this.metadataPayload.asObservable();
    private handoverPermission = new Subject<any>();
    public permission = this.handoverPermission.asObservable();
    private flags = new Subject<any>();
    public flag = this.flags.asObservable();
    private accesDen = new Subject<any>();
    public accesDenied = this.accesDen.asObservable();
    constructor(
        private store: Store<MetadataState>,
        private metadataActions: MetadataActions,
    ) { }

    // store section

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function return list values by type
     *
     * @param type
     */
    getListDetails(type?: string) {
        switch (type) {
            case 'status':
                return this.getStatusDetails();
            case 'priority':
                return this.getPriorityDetails();
            case 'responsible':
                return this.getUserDetails();
            case 'delegate':
                return this.getDelegateToDetails();
            case 'permission':
                return this.getDocumentPermissionDetails();
            default:
                return this.getMetdataDetails();
            case 'project':
                return this.getProjectDetails();

        }
    }

    /**
    * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    *
    * Function to get metedata details from store
   */
    public getMetdataDetails(): Observable<object> {
        return this.store.select((appState) => {
            return appState.metadata.metadataDetails;
        });
    }

    /**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to get status details from store
*/
    public getStatusDetails(): Observable<object> {
        return this.store.select((appState) => {
            return appState.metadata.statusDetails;
        });
    }

    /**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to get priority details from store
*/
    public getPriorityDetails(): Observable<object> {
        return this.store.select((appState) => {
            return appState.metadata.priorityDetails;
        });
    }

    /**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to get user details from store
*/
    public getUserDetails(): Observable<object> {
        return this.store.select((appState) => {
            return appState.metadata.usersDetails;
        });
    }

    /**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to get delegate to details from store
*/
    public getDelegateToDetails(): Observable<object> {
        return this.store.select((appState) => {
            return appState.metadata.delegateDetails;
        });
    }

    /**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to get document permission details from store
*/
    public getDocumentPermissionDetails(): Observable<object> {
        return this.store.select((appState) => {
            return appState.metadata.permissionDetails;
        });
    }

    /**
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
* Function to get user permission details from store
*/
    public getUserPermissionDetails(): Observable<object> {
        return this.store.select((appState) => {
            return appState.metadata.userPermissionDetails;
        });
    }

    /**
 * @author David Raja <david.ra@pitsolutions.com>
 *
 * Function to get payload changes
*/
    public changePayload(payload: any) {
        this.metadataPayload.next(payload);
    }

    /**
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
* Function to get project details from store
*/
    public getProjectDetails(): Observable<object> {
        return this.store.select((appState) => {
            return appState.metadata.projectDetails;
        });
    }

    /**
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
* updates handover permissions
*/
    public chnageHandoverPermission(permission: boolean) {
        this.handoverPermission.next(permission);
    }

    /**
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
* updates handover permissions
*/
    public toggleFlag(value: boolean) {
        this.flags.next(value);
    }

    /**
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
* reset metadata on error 403
*/
    public resetMetadata(value: boolean) {
        this.accesDen.next(value);
    }

}
