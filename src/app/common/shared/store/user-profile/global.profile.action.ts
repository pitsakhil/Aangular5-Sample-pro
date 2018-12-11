import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createAction } from './../createAction';
import { GlobalProfileState } from '../../models/quicknoteState.model';




@Injectable()
export class GlobalProfileActions {

    static FETCH_GLOBAL_PROFILE_DETAILS = 'FETCH_GLOBAL_PROFILE_DETAILS';
    static UPDATE_GLOBAL_PROFILE_DETAILS = 'UPDATE_GLOBAL_PROFILE_DETAILS';
    static RESET_GLOBAL_PROFILE_DETAILS = 'RESET_GLOBAL_PROFILE_DETAILS';


    constructor(private store: Store<GlobalProfileState>) { }

    /**
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    *
    * Action to fetch ag grid row data
    */

    public fetchGlobalProfileData(userid) {
        this.store.dispatch(createAction(GlobalProfileActions.FETCH_GLOBAL_PROFILE_DETAILS, userid));
    }

    /**
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    *
    * Action  to update the ag grid rows(mail folders)
    * @param data
    */
    public updateGlobalProfileData(storageData: Array<Object>) {
        this.store.dispatch(createAction(GlobalProfileActions.UPDATE_GLOBAL_PROFILE_DETAILS, storageData));
    }

    /**
     * Action to reset profile data
     * 
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    */
    public resetGlobalProfileData() {
        this.store.dispatch(createAction(GlobalProfileActions.RESET_GLOBAL_PROFILE_DETAILS));
    }

}
