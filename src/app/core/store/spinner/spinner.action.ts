import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CoreModuleState } from './../../models/core.module.state.model';
import { createAction } from './../createAction';

@Injectable()
export class SpinnerActions {

    static UPDATE_SPINNER_STATE = 'UPDATE_SPINNER_STATE';

    constructor(private store: Store<CoreModuleState>) { }

    updateStorage(storageData: any) {
        this.store.dispatch(createAction(SpinnerActions.UPDATE_SPINNER_STATE, storageData));
    }
}
