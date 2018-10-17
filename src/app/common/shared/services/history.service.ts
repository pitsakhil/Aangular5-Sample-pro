import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { HistoryState } from '../models/historyState.model';
import { HistoryActions } from '../store/history.actions';
import { HistoryUrls } from './../../../core/constants/config';

@Injectable()
export class HistoryService {
  private historyPayload = new Subject<any>();
  currentPayload = this.historyPayload.asObservable();
  constructor(
    private _store: Store<HistoryState>,
    private _contactActions: HistoryActions,
  ) { }
  /**
   * @author David Raja <david.ra@pitsolutions.com>
   *
   * Function to get history list data from the store
  */
  public getCurrentHistoryData(): Observable<Object> {
    return this._store.select((appState) => appState.history.historyListData);
  }
  /**
   * @author David Raja <david.ra@pitsolutions.com>
   *
   * Function to get payload changes
  */
  public changePayload(payload: any) {
    this.historyPayload.next(payload);
  }

}
