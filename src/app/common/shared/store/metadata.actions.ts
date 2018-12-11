import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createAction } from './createAction';
import { MetadataState } from '../models/metadataState.model';


@Injectable()
export class MetadataActions {
    static UPDATE_METADATA = 'UPDATE_METADATA';
    static FETCH_METADATA = 'FETCH_METADATA';
    static FETCH_STATUS = 'FETCH_STATUS';
    static UPDATE_STATUS = 'UPDATE_STATUS';
    static FETCH_PRIORITY = 'FETCH_PRIORITY';
    static UPDATE_PRIORITY = 'UPDATE_PRIORITY';
    static FETCH_USERS = 'FETCH_USERS';
    static UPDATE_USERS = 'UPDATE_USERS';
    static FETCH_METADATA_TEMPLATE = 'FETCH_METADATA_TEMPLATE';
    static UPDATE_METADATA_TEMPLATE = 'UPDATE_METADATA_TEMPLATE';
    static FETCH_DOCUMENT_PERMISSION = 'FETCH_DOCUMENT_PERMISSION';
    static UPDATE_DOCUMENT_PERMISSION = 'UPDATE__DOCUMENT_PERMISSION';
    static FETCH_DELEGATE_TO = 'FETCH_DELEGATE_TO';
    static UPDATE_DELEGATE_TO = 'UPDATE__DELEGATE_TO';
    static FETCH_MODULES = 'FETCH_MODULES';
    static UPDATE_MODULES = 'UPDATE_MODULES';
    static UPDATE_USER_PERMISSIONS = 'UPDATE_USER_PERMISSIONS';
    static FETCH_PROJECTS = 'FETCH_PROJECTS';
    static UPDATE_PROJECTS = 'UPDATE_PROJECTS';

    constructor(public store: Store<MetadataState>) { }

    /**
* Action to fetch metadata from server

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public fetchMetadata(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.FETCH_METADATA, payload));
    }

    /**
* Action to update metadata in store

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public updateMetadataDetails(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.UPDATE_METADATA, payload));
    }

    /**
* Action to fetch status from server

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public fetchStatus(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.FETCH_STATUS, payload));
    }

    /**
* Action to update status details in store

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public updateStatus(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.UPDATE_STATUS, payload));
    }

    /**
* Action to fetch priority details from server

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public fetchPriority(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.FETCH_PRIORITY, payload));
    }

    /**
* Action to update priority details in store

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public updatePriority(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.UPDATE_PRIORITY, payload));
    }

    /**
* Action to fetch user details from server

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public fetchUsers(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.FETCH_USERS, payload));
    }

    /**
* Action to save user details in store

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public updateUsers(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.UPDATE_USERS, payload));
    }

    /**
* Action to get document permissions

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public fetchDocumentPermission(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.FETCH_DOCUMENT_PERMISSION, payload));
    }

    /**
* Action to get delegate to details

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public fetchDelegateTo(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.FETCH_DELEGATE_TO, payload));
    }

    /**
* Action to save document permissions in store

* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*/
    public updateDocumentPermission(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.UPDATE_DOCUMENT_PERMISSION, payload));
    }

    /**
    * Action to save delegate to details in store

    * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    */
    public updateDelegateTo(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.UPDATE_DELEGATE_TO, payload));
    }

    /**
 * Action to user permissions in store

 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 */
    public updateUserPermissions(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.UPDATE_USER_PERMISSIONS, payload));
    }

    /**
      * Action to get project details
  
      * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
      */

    public fetchProject(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.FETCH_PROJECTS, payload));
    }

    /**
    * Action to update project details in store
    
    * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    */
    public updateProject(payload: Object): void {
        this.store.dispatch(createAction(MetadataActions.UPDATE_PROJECTS, payload));
    }



}
