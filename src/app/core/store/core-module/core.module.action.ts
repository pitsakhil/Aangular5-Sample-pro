import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createAction } from './../createAction';
import { CoreModuleState } from './../../models/core.module.state.model';

@Injectable()
export class CoreModuleActions {

    static FETCH_TIMEZONE_DATE_FORMAT = 'FETCH_TIMEZONE_DATE_FORMAT';
    static FETCH_USER_ACCOUNT_DATA = 'FETCH_USER_ACCOUNT_DATA';
    static UPDATE_USER_ACCOUNT_DATA = 'UPDATE_USER_ACCOUNT_DATA';
    static UPDATE_DATE_FORMAT = 'UPDATE_DATE_FORMAT';
    static UPDATE_TIMEZONE = 'UPDATE_TIMEZONE';
    static UPDATE_LANGUAGE = 'UPDATE_LANGUAGE';
    static FETCH_WEEK_DAYS = 'FETCH_WEEK_DAYS';
    static UPDATE_WEEK_DAYS = 'UPDATE_WEEK_DAYS';
    static FETCH_TIME_FORMAT = 'FETCH_TIME_FORMAT';
    static UPDATE_TIME_FORMAT = 'UPDATE_TIME_FORMAT';
    static FETCH_EVENT_REMINDERS = 'FETCH_EVENT_REMINDERS';
    static UPDATE_EVENT_REMINDERS = 'UPDATE_EVENT_REMINDERS';

    static FETCH_NAVBAR_DATA = 'FETCH_NAVBAR_DATA';
    static UPDATE_MODULE_NAVBAR = 'UPDATE_MODULE_NAVBAR';
    static RESET_MODULE_NAVBAR = 'RESET_MODULE_NAVBAR';

    constructor(private store: Store<CoreModuleState>) { }

    /**
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    *
    * Action to fetch timezone and date format from api
    */

    public fetchTimezoneDateFormat() {
        this.store.dispatch(createAction(CoreModuleActions.FETCH_TIMEZONE_DATE_FORMAT));
    }
    public fetchWeekDays(payload: Object) {
        this.store.dispatch(createAction(CoreModuleActions.FETCH_WEEK_DAYS, payload));
    }
    public fetchEventReminders(payload: Object) {
        this.store.dispatch(createAction(CoreModuleActions.FETCH_EVENT_REMINDERS, payload));
    }
    public fetchTimeFormat(payload: Object) {
        this.store.dispatch(createAction(CoreModuleActions.FETCH_TIME_FORMAT, payload));
    }
    /**
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    *
    * Action  to update the timezone
    * @param data: userid
    */

    public updateTimezone(storageData: Array<Object>) {
        this.store.dispatch(createAction(CoreModuleActions.UPDATE_TIMEZONE, storageData));
    }

    /**
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    *
    * Action  to update the dateformat
    * @param data: userid
    */

    public updateDateFormat(storageData: Array<Object>) {
        this.store.dispatch(createAction(CoreModuleActions.UPDATE_DATE_FORMAT, storageData));
    }

    /**
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    *
    * Action  to update the language
    * @param data: userid
    */

    public updateLanguage(storageData: Array<Object>) {
        this.store.dispatch(createAction(CoreModuleActions.UPDATE_LANGUAGE, storageData));
    }


    /**
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    *
    * Action  to fetch user account details from api
    * @param data: userid
    */

    public fetchUserAccountData() {
        this.store.dispatch(createAction(CoreModuleActions.FETCH_USER_ACCOUNT_DATA));
    }

    /**
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    *
    * Action  to update the user account details
    * @param data: userid
    */

    public updateUserAccountData() {
        this.store.dispatch(createAction(CoreModuleActions.UPDATE_USER_ACCOUNT_DATA));
    }
    public updateWeekDays(storageData: Array<Object>) {
        this.store.dispatch(createAction(CoreModuleActions.UPDATE_WEEK_DAYS, storageData));
    }
    public updateTimeFormat(storageData: Array<Object>) {
        this.store.dispatch(createAction(CoreModuleActions.UPDATE_TIME_FORMAT, storageData));
    }
    public updateEventReminders(storageData: Array<Object>) {
        this.store.dispatch(createAction(CoreModuleActions.UPDATE_EVENT_REMINDERS, storageData));
    }

    /**
   * This action will dispatch an action to fetch document data from server
   * 
   * @author Vijayan PP<vijayan.pp@pitsolutions.com>
  */
    public fetchNavbarData(): void {

        this.store.dispatch(createAction(CoreModuleActions.FETCH_NAVBAR_DATA));
    }

    /**
    * Action  to update the navigation bar(side menu)
    * @param data
    * 
    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public updateNavBar(data: Array<Object>) {
        this.store.dispatch(createAction(CoreModuleActions.UPDATE_MODULE_NAVBAR, data));
    }

}
