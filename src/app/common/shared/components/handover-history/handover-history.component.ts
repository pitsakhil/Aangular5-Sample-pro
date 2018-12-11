import { Component, OnInit, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { skip } from 'rxjs/operators';
import { GridOptions } from 'ag-grid';
import 'ag-grid-enterprise';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { HandoverHistoryService } from '../../services/handover-history.service';
import { HandoverHistoryActions } from '../../store/handoverHistory.action';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
let that: any;
@Component({
  selector: 'app-handover-history',
  templateUrl: './handover-history.component.html',
  styleUrls: ['./handover-history.component.scss'],
  providers: [DateFormatPipe]
})
export class HandoverHistoryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() documentId: number;
  @Output() handoverText: EventEmitter<any> = new EventEmitter();
  private _subscriptions = new Subscription();
  public gridOptions: GridOptions;
  constructor(
    private _handoverHistoryService: HandoverHistoryService,
    private _handoverHistoryActions: HandoverHistoryActions,
    private _translate: TranslateService,
    private _dateFormatPipe: DateFormatPipe
  ) {
    that = this;
  }

  ngOnInit() {
    this._init();
  }

  ngOnChanges(changes) {
    this._onInputChange(changes);
  }

  private _init(): void {
    this._gridInitialize();
  }

  private _onInputChange(changes): void {
    if (!changes) {
      return undefined;
    }
    if (changes && changes['documentId'] && !!this.documentId) {
      this._handoverHistoryActions.fetchHistoryData({ document_id: this.documentId });
    }
  }


  /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to load data for ag-grid table
     */
  private _fetchTableData(): void {
    this._subscriptions.add(
      this._handoverHistoryService.getCurrentHistoryData()
        .pipe(skip(1))
        .subscribe({
          next: (res) => {
            const data = res['handoverList'];
            const checkValid = !!this.gridOptions['api'] && !!data && !!data['list'];
            if (!checkValid) {
              this.gridOptions.api.setRowData(null);
              return;
            }
            this.gridOptions.api.setRowData(data['list']);
          }, error: (err) => { }
        }));
  }

  /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to set column definition for grid table
     */
  private _columnDefs(): Array<Object> {
    return [
      {
        headerName: that._translate.instant('aggrid.Date'), width: 300,
        field: 'modified_on', cellRenderer: 'dateCellRenderer',
        cellClass: ['ag-str-cell'],
        suppressMenu: true, suppressFilter: true
      },
      {
        headerName: that._translate.instant('aggrid.User'),
        field: 'modified_by_person', cellClass: ['ag-str-cell'],
        suppressMenu: true, suppressFilter: true
      },
      {
        headerName: that._translate.instant('aggrid.HandoverFrom'),
        field: 'handover_from_person',
        cellClass: ['ag-str-cell'],
        suppressMenu: true, suppressFilter: true
      },
      {
        headerName: that._translate.instant('aggrid.HandoverTo'),
        field: 'handover_to_person',
        cellClass: ['ag-str-cell'],
        suppressMenu: true, suppressFilter: true
      },
      {
        headerName: that._translate.instant('aggrid.HandoverText'),
        field: 'handover_text', cellRenderer: 'longTextCellRenderer',
        cellClass: ['ag-str-cell'],
        suppressMenu: true, suppressFilter: true,
      },
      {
        headerName: that._translate.instant('aggrid.Deadline'), width: 300,
        field: 'deadline', cellRenderer: 'dateCellRenderer',
        cellClass: ['ag-str-cell'],
        suppressMenu: true, suppressFilter: true,
      }
    ];
  }

  /**
   * Function to render the date formats.
   *
   * @author David Raja <david.ra@pitsolutions.com>
   *
   * @param params
   */
  private _dateCellRenderer(params: any): string {
    const columnName = params.column.getColId();
    const data = params.data;
    let formattedDate = '';
    if (!!data) {
      switch (columnName) {
        case 'modified_on':
          formattedDate = (!!data['modified']['on']) ? `${that._dateFormatPipe.transform(data['modified']['on'])}` : '';
          break;
        case 'deadline':
          formattedDate = (!!data['deadline']) ? `${that._dateFormatPipe.transform(data['deadline'])}` : '';
          break;
      }
      return `<span> ${formattedDate}</span>`;
    }
  }

  /**
   * Function to render long text.
   *
   * @author David Raja <david.ra@pitsolutions.com>
   *
   * @param params
   */
  private _longTextCellRenderer(params: any): string {
    const data = params.data;
    let formattedText = '';
    if (!!data) {
      const longText = (!!data['handover_text']) ? data['handover_text'] : '';
      formattedText = longText.length > 13 ?
        `${longText.trim().substring(0, 11)} <i data-toggle="modal" data-target="#longTextModal" class="material-icons expand before-after">open_in_new</i>` : `${longText}`;
    }
    return `<span> ${formattedText}</span>`;
  }

  /**
* @author David Raja <david.ra@pitsolutions.com>
*
* @param params
*
* Function to update grid on Grid Ready
*/
  private _cellClickedFunction(params: any) {
    if (!params) {
      return null;
    }
    const columnName = params.column.getColId();
    if (columnName === 'handover_text') {
      const data = params.data;
      that._showModal(data);
    }
  }

  /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param data
     *
     * Function to set modal data
     */
  private _showModal(data) {
    let handoverTextVal = '';
    const handoverText = !!data['handover_text'] ? data['handover_text'] : '';
    if (handoverText.length > 0) {
      handoverTextVal = handoverText;
    }
    this.handoverText.emit(handoverTextVal);
  }

  /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to initialize grid list
     */
  private _gridInitialize(): void {
    this.gridOptions = <GridOptions>{
      components: {
        dateCellRenderer: this._dateCellRenderer,
        longTextCellRenderer: this._longTextCellRenderer,
      },
      icons: {
        sortAscending: '<i class="material-icons icon-18 icon-sort-asc">keyboard_arrow_down</i>',
        sortDescending: '<i class="material-icons icon-18 icon-sort-desc">keyboard_arrow_up</i>',
      },
      columnDefs: this._columnDefs(),
      rowSelection: 'single',
      rowDeselection: true,
      enableColResize: true,
      suppressContextMenu: true,
      defaultColDef: true,
      overlayLoadingTemplate: `<span>${this._translate.instant('Loading')}....</span>`,
      overlayNoRowsTemplate: `<span class="h3 text-grey">${this._translate.instant('No rows')}</span>`,
      // gridAutoHeight: true,
      onGridReady: (params) => {
        that._fetchTableData();
        params.api.sizeColumnsToFit();
      },
      onViewportChanged: (params) => {
        params.api.sizeColumnsToFit();
      },
      onCellClicked: this._cellClickedFunction,
    };
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

}
