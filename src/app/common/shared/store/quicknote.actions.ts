import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createAction } from './createAction';
import { QuicknoteState } from '../models/quicknoteState.model';


@Injectable()
export class QuicknoteActions {
    static FETCH_QUICKNOTES_LIST = 'FETCH_QUICKNOTES_LIST';
    static UPDATE_QUICKNOTES_LIST = 'UPDATE_QUICKNOTES_LIST';
    static FETCH_CREATE_QUICKNOTE = 'FETCH_CREATE_QUICKNOTE';
    static UPDATE_CREATE_QUICKNOTE = 'UPDATE_CREATE_QUICKNOTE';
    static FETCH_EDIT_QUICKNOTE = 'FETCH_EDIT_QUICKNOTE';
    static UPDATE_EDIT_QUICKNOTE = 'UPDATE_EDIT_QUICKNOTE';
    static INITIATE_DELETE_QUICKNOTE = 'INITIATE_DELETE_QUICKNOTE';
    static UPDATE_DELETE_QUICKNOTE = 'UPDATE_DELETE_QUICKNOTE';

    constructor(public store: Store<QuicknoteState>) { }

    /**
    * Action to fetch quicknotes from server
    * @author David Raja <david.ra@pitsolutions.com>
    */
    public fetchQuicknotes(payload: Object): void {
        this.store.dispatch(createAction(QuicknoteActions.FETCH_QUICKNOTES_LIST, payload));
    }
    /**
    * Action to update quicknotes in store
    * @author David Raja <david.ra@pitsolutions.com>
    */
    public updateQuicknotes(payload: Object): void {
        this.store.dispatch(createAction(QuicknoteActions.UPDATE_QUICKNOTES_LIST, payload));
    }
    /**
    * Action to add quicknotes to server
    * @author David Raja <david.ra@pitsolutions.com>
    */
    public addQuicknote(payload: Object): void {
        this.store.dispatch(createAction(QuicknoteActions.FETCH_CREATE_QUICKNOTE, payload));
    }
    /**
    * Action to update newly added quicknotes in store
    * @author David Raja <david.ra@pitsolutions.com>
    */
    public updateAddQuicknote(payload: Object): void {
        this.store.dispatch(createAction(QuicknoteActions.UPDATE_CREATE_QUICKNOTE, payload));
    }
    /**
    * Action to add quicknotes to server
    * @author David Raja <david.ra@pitsolutions.com>
    */
    public saveQuicknote(payload: Object): void {
        this.store.dispatch(createAction(QuicknoteActions.FETCH_EDIT_QUICKNOTE, payload));
    }
    /**
    * Action to update newly added quicknotes in store
    * @author David Raja <david.ra@pitsolutions.com>
    */
    public updateSaveQuicknote(payload: Object): void {
        this.store.dispatch(createAction(QuicknoteActions.UPDATE_EDIT_QUICKNOTE, payload));
    }
    /**
    * Action to delete quicknotes from server
    * @author David Raja <david.ra@pitsolutions.com>
    */
    public deleteQuicknote(payload: Object): void {
        this.store.dispatch(createAction(QuicknoteActions.INITIATE_DELETE_QUICKNOTE, payload));
    }
    /**
    * Action to update deleted quicknotes in store
    * @author David Raja <david.ra@pitsolutions.com>
    */
    public updateDeleteQuicknote(payload: Object): void {
        this.store.dispatch(createAction(QuicknoteActions.UPDATE_DELETE_QUICKNOTE, payload));
    }
}

