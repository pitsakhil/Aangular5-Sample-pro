import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { QuicknoteState, GlobalProfileState } from '../models/quicknoteState.model';
import { QuicknoteActions } from '../store/quicknote.actions';

@Injectable()
export class QuicknoteService {

    constructor(
        private store: Store<QuicknoteState>,
        private quicknoteActions: QuicknoteActions,
        private _storeGlobalProfile: Store<GlobalProfileState>
    ) { }

    /**
    * @author David Raja <david.ra@pitsolutions.com>
    *
    * Function to return quicknotes list from store
    */
    public getQuicknotesList(): Observable<object> {
        return this.store.select((appState) => {
            return appState.quicknotes.quicknotesList;
        });
    }

    /**
  * @author David Raja <david.ra@pitsolutions.com>
  *
  * Function to return quicknotes recently added from store
  */
    public addQuicknote(): Observable<object> {
        return this.store.select((appState) => {
            return appState.quicknotes.quicknote;
        });
    }

    /**
  * @author David Raja <david.ra@pitsolutions.com>
  *
  * Function to return recently saved quicknote from store
  */
    public saveQuicknote(): Observable<object> {
        return this.store.select((appState) => {
            return appState.quicknotes.saveQuicknote;
        });
    }

    /**
  * @author David Raja <david.ra@pitsolutions.com>
  *
  * Function to return recently deleted quicknote from store
  */
    public deleteQuicknote(): Observable<object> {
        return this.store.select((appState) => {
            return appState.quicknotes.deleteQuickNote;
        });
    }

    public getGlobalProfile(): Observable<Object> {
        return this._storeGlobalProfile.select((appState) => {
            return appState['globalProfile'].userdata;
        });
    }

}
