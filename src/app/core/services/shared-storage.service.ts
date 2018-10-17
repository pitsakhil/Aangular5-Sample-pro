import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CoreModuleState } from './../models/core.module.state.model';


@Injectable()
export class SharedStorageService {

    constructor(private store: Store<CoreModuleState>) { }

    getSpinnerState(): Observable<any> {
        return this.store.select(state => state.spinner);
    }

    getTimezoneDate(): Observable<any> {
        return this.store.select((appState) => {
            return appState.timezoneDate;
        });
    }

    getUserAccountDetails(): Observable<any> {
        return this.store.select((appState) => {
            return appState.timezoneDate.userAccountData;
        });
    }
    getGeneralData(): Observable<any> {
        return this.store.select((appState) => {
            return appState.sourceValueData;
        });
    }

    public getDocumentNavigationBarData(): Observable<Array<Object>> {
        return this.store.select((appState) => {
            return appState.moduleData.navbarData;
        });
    }



}
