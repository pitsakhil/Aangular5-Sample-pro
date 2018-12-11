import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { HandoverHistoryState } from '../models/handoverHistoryState.model';

@Injectable()
export class HandoverHistoryService {

  constructor(private _store: Store<HandoverHistoryState>) { }
  /**
   * @author David Raja <david.ra@pitsolutions.com>
   *
   * Function to get history list data from the store
  */
  public getCurrentHistoryData(): Observable<Object> {
    return this._store.select((appState) => appState.handoverHistory.handoverList);
  }
}
