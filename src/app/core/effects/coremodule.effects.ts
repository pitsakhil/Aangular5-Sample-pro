import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// import all rxjs operators that are needed
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

// import store state interface

// import all api calls
import { ApiService } from './../services';
import { of } from 'rxjs/observable/of';
import { AuthService } from './../auth';
import { SystemsettingsUrls, GeneralUrls, UserSettingsUrls, DocumentUrls } from '../constants/config';
import { CoreModuleActions } from '../store';

import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class CoreModuleEffects {
    jwtHelper: JwtHelper = new JwtHelper();
    constructor(
        private actions$: Actions,
        private apiService: ApiService,
        private authService: AuthService,
    ) {

    }

    /**
     * Effects to fetch timezone.
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */
    @Effect()
    protected fetchtimezone: Observable<Action> = this.actions$
        .ofType(CoreModuleActions.FETCH_TIMEZONE_DATE_FORMAT)
        .map(response => response)
        .switchMap(() =>
            this.apiService.get(SystemsettingsUrls.TIMEZONES)
                .switchMap(result =>
                    Observable.of({ type: CoreModuleActions.UPDATE_TIMEZONE, payload: { timezone: result.data.list } })
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })

        );

    /**
     * Effects to fetch dateformat
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */
    @Effect()
    protected fetchdateformat: Observable<Action> = this.actions$
        .ofType(CoreModuleActions.FETCH_TIMEZONE_DATE_FORMAT)
        .map(response => response)
        .switchMap(() =>
            this.apiService.get(SystemsettingsUrls.LIST_DATE_TIME_FORMATS)
                .switchMap(result =>
                    Observable.of({ type: CoreModuleActions.UPDATE_DATE_FORMAT, payload: { dateformat: result.data.list } })
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })

        );

    /**
     * Effects to fetch language
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */
    @Effect()
    protected fetchlanguage: Observable<Action> = this.actions$
        .ofType(CoreModuleActions.FETCH_TIMEZONE_DATE_FORMAT)
        .map(response => response)
        .switchMap(() =>
            this.apiService.get(SystemsettingsUrls.SYSTEM_SETTINGS_LANGUAGE)
                .switchMap(result =>
                    Observable.of({ type: CoreModuleActions.UPDATE_LANGUAGE, payload: { language: result.data.list } })
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })

        );

    /**
     * Effects to fetch user account details
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */
    @Effect()
    protected fetchUserDetails: Observable<Action> = this.actions$
        .ofType(CoreModuleActions.FETCH_USER_ACCOUNT_DATA)
        .map(response => response)
        .switchMap(() =>
            this.apiService.post(GeneralUrls.REGENERATE_TOKEN, { lang: localStorage.getItem('lang') }, 'auth')
                .switchMap(result =>
                    Observable.of({ type: CoreModuleActions.UPDATE_USER_ACCOUNT_DATA, payload: { USER_ACCOUNT_DATA: result.data.token } })
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })

        );
    @Effect()
    protected fetchweekdays: Observable<Action> = this.actions$
        .ofType(CoreModuleActions.FETCH_WEEK_DAYS)
        .map(response => response
        )
        .switchMap((action) => {
            return this.apiService.get(`${UserSettingsUrls.GENERAL_DATA}?source=${action['payload']['source']}`)
                .switchMap(result => {
                    return Observable.of({ type: CoreModuleActions.UPDATE_WEEK_DAYS, payload: { weekdays: result.data } });

                }
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                });
        }
        );

    @Effect()
    protected fetchTimeFormat: Observable<Action> = this.actions$
        .ofType(CoreModuleActions.FETCH_TIME_FORMAT)
        .map(response => response
        )
        .switchMap((action) => {
            return this.apiService.get(`${UserSettingsUrls.GENERAL_DATA}?source=${action['payload']['source']}`)
                .switchMap(result => {
                    return Observable.of({ type: CoreModuleActions.UPDATE_TIME_FORMAT, payload: { timeformat: result.data } });
                }
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                });
        }
        );

    @Effect()
    protected fetchEventReminders: Observable<Action> = this.actions$
        .ofType(CoreModuleActions.FETCH_EVENT_REMINDERS)
        .map(response => response
        )
        .switchMap((action) => {
            return this.apiService.get(`${UserSettingsUrls.GENERAL_DATA}?source=${action['payload']['source']}`)
                .switchMap(result => {
                    return Observable.of({ type: CoreModuleActions.UPDATE_EVENT_REMINDERS, payload: { event_remainders: result.data } });
                }
                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                });
        }
        );

    @Effect()
    // tslint:disable-next-line:max-line-length
    protected navBarData$: Observable<Action> = this.actions$
        .ofType(CoreModuleActions.FETCH_NAVBAR_DATA).switchMap(() =>
            this.apiService.get(DocumentUrls.MODULE_LIST)
                .switchMap(result => {

                    return Observable.of({ type: CoreModuleActions.UPDATE_MODULE_NAVBAR, payload: result.data  });
                }

                ).catch(error => {
                    return Observable.of({ type: 'FAIL', payload: error });
                })
        );

}

