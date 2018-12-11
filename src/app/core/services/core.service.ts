import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CoreModuleState } from '../models/core.module.state.model';

@Injectable()
export class CoreService {

    constructor(private store: Store<CoreModuleState>) { }


    /**
      * @author Vijayan PP <vijayan.pp@pitsolutions.com>
      *
      * Function to get navigation bar data from the store
    */
    public getNavigationBarData(): Observable<Array<Object>> {
        return this.store.select((appState) => {
            return appState.moduleData.navbarData;
        });
    }
}
