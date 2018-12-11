import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { GridOptions } from 'ag-grid';
import { GeneralUrls } from '../../../../core/constants/config';
import 'ag-grid-enterprise';
import { Subscription } from 'rxjs/Subscription';

import { HistoryService } from '../../services/history.service';
import { HistoryActions } from './../../store/history.actions';
import { ListHistoryData } from '../../models/historyList.model';
import { NotificationService } from '../../../../common/notification/services/notification.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { AgGridSortingHeaderComponent } from '../ag-grid-sorting-header/ag-grid-sorting-header.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../../core/services';
import { skip } from 'rxjs/operators';

let that: any;

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    providers: [DateFormatPipe]
})

export class HistoryComponent implements OnInit, OnDestroy, OnChanges {
    afterVal: any;
    beforeVal: any;
    public moduleName: string;
    @Input() documentId: number;
    private _page_size: number;
    private _actions: any = [];
    private _subscriptions = new Subscription();
    public listHistoryData: ListHistoryData = {};
    protected referenceList: Object;
    protected actionList: Object;
    public payload: any;
    public actionsId: any = [];
    public actionForm: FormGroup;
    public gridOptions: GridOptions;
    public timezoneTimeDiff: { 'timeDiff': string; 'dateformat': string; 'timeformat': string; };
    public handoverDescription: Event;
    constructor(
        private _location: Location,
        private _historyActions: HistoryActions,
        private _historyService: HistoryService,
        private _apiService: ApiService,
        private _notificationService: NotificationService,
        private _fb: FormBuilder,
        private _dateFormatPipe: DateFormatPipe,
        private _sanitizer: DomSanitizer,
        private _translate: TranslateService
    ) {
        that = this;
    }

    ngOnInit() {
        this._init();
        this._page_size = 0;
        this._historyService.currentPayload.subscribe(payload => this.payload = payload);
    }

    ngOnChanges(changes) {
        this.documentId = changes['documentId']['currentValue'];
        this.actionForm = this.initActionForm();
        this._actions = [1, 2, 3, 4];
        this.actionsId = []; // to clear the action list whenever userId is changed
    }

    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to initialize primary functions on component load
     */
    private _init(): void {
        this.actionForm = this.initActionForm();
        this._initVariables(this.listHistoryData);
        this._gridInitialize();
        this._loadDataOnScroll();
        this.timezoneTimeDiff = {
            'timeDiff': localStorage.getItem('timeDiff'),
            'dateformat': localStorage.getItem('dateformat'),
            'timeformat': localStorage.getItem('timeformat')
        };
        const url = this._location.path();
        this.moduleName = url.split('/')[1];
        this._getActionList();
    }

    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to initialize form group
     */
    private initActionForm(): FormGroup {
        return this._fb.group({
            name: [''],
            value: [''],
            state: [true]
        });
    }

    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param obj:Object
     *
     * Function to initialize variables for History List Data store variable (aka) listHistoryData
     */
    private _initVariables(obj: Object): ListHistoryData {
        if (!!obj) {
            return Object.assign(obj, {
                document_id: this.documentId,
                start_page: 1,
                count: 25,
                viewHistory: true,
                viewHandover: false,
                sort_by: 'modified_on',
                sort_order: 'DESC',
                actions: this._actions,
                params: {}
            });
        } else {
            return null;
        }
    }

    private _getActionList(): void {
        this._apiService.get(GeneralUrls.ACTION_LIST).subscribe({
            next: (res) => {
                this.actionList = res.data;
            }, error: (err) => { }
        });
    }

    public toggleTab(tab: string): void {
        if (tab === 'history') {
            this.listHistoryData.viewHistory = true;
            this.listHistoryData.viewHandover = false;
        } else if (tab === 'handover') {
            this.listHistoryData.viewHistory = false;
            this.listHistoryData.viewHandover = true;
        }
    }

    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to load data for ag-grid table while scrolling
     */
    private _loadDataOnScroll(): void {
        this._subscriptions.add(
            this._historyService.getCurrentHistoryData()
                .pipe(skip(1))
                .subscribe({
                    next: (res) => {
                        const data = res['historyListData'];
                        const checkValid = !!this.gridOptions['api'] && !!data && !!data['list'] && !!data['params'];
                        if (!checkValid) {
                            return;
                        }
                        this._formatDate(data['list']);
                        const actionsId = this.actionList;
                        if (this.actionsId.length === 0) {
                            for (const key in actionsId) {
                                if (key) {
                                    this.actionsId.push({ id: actionsId[key].id, actions: actionsId[key].actions });
                                }
                            }
                        } else {
                            const _actionId = this.actionsId;
                            for (const key in actionsId) {
                                if (key) {
                                    _actionId.forEach(function (v) {
                                        if (v.id === actionsId[key].id) {
                                            v.actions = actionsId[key].actions;
                                        }
                                    });
                                }
                            }
                            this.actionsId = _actionId;
                        }
                        data['params'].successCallback(data['list'], data['total_results']);
                    }, error: (err) => {
                        // tslint:disable-next-line:no-unused-expression
                        (err.error) && this._notificationService.error('error', err.error.message);
                    }
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
                headerName: that._translate.instant('aggrid.Date'), width: 250,
                field: 'modified_on', cellClass: ['ag-str-cell'],
                suppressMenu: true, suppressFilter: true
            },
            {
                headerName: that._translate.instant('aggrid.Name'),
                field: 'modified_by', cellClass: ['ag-str-cell'],
                suppressMenu: true, suppressFilter: true, suppressSorting: true
            },
            {
                headerName: that._translate.instant('aggrid.Action'),
                field: 'action_id', cellRenderer: 'actionCellRenderer',
                cellClass: ['ag-str-cell'],
                suppressMenu: true, suppressFilter: true, suppressSorting: true
            },
            {
                headerName: that._translate.instant('aggrid.Field'),
                field: 'fieldName', cellRenderer: 'fieldCellRenderer',
                cellClass: ['ag-str-cell'],
                suppressMenu: true, suppressFilter: true, suppressSorting: true
            },
            {
                headerName: that._translate.instant('aggrid.Before'), width: 150,
                field: 'before',
                cellRenderer: 'beforeAfterCellRenderer',
                cellClass: ['ag-str-cell'],
                suppressMenu: true, suppressFilter: true, suppressSorting: true
            },
            {
                headerName: that._translate.instant('aggrid.After'), width: 150,
                field: 'after',
                cellRenderer: 'beforeAfterCellRenderer',
                cellClass: ['ag-str-cell'],
                suppressMenu: true, suppressFilter: true, suppressSorting: true
            }
        ];
    }
    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param params
     *
     * Function to render action column of ag-grid table with images
     */
    private _actionCellRenderer(params: any) {
        const data = params.data;
        if (!!data) {
            const actionVal = data['action'];
            let img = '';
            switch (data['action_id']) {
                case 4:
                    img = '<i class="material-icons icon-black">delete</i>';
                    break;
                case 3:
                    img = '<i class="material-icons icon-black">visibility</i>';
                    break;
                case 2:
                    img = '<i class="material-icons icon-black">edit</i>';
                    break;
                case 1:
                    img = '<i class="material-icons icon-black">add</i>';
                    break;
            }
            return '<span>' + img + ' ' + actionVal + '</span>';
        }
    }

    private _fieldCellRenderer(params: any) {
        const data = params.data;
        if (data) {
            return (!!data['field']) ? data['field'] : '';
        }
    }
    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param params
     *
     * Function to render before column of ag-grid table with images
     */
    private _beforeAfterCellRenderer(params: any) {
        const columnName = params.column.getColId();
        const data = params.data;
        if (!!data) {
            let cellData = '';
            switch (columnName) {
                case 'before':
                    cellData = !!data['before'] ? data['before'] : '';
                    break;
                case 'after':
                    cellData = !!data['after'] ? data['after'] : '';
                    break;
            }
            if (cellData) {
                cellData = that._cellRenderer(cellData, data['field']);
            }
            return cellData;
        }
    }

    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param cellData
     *
     * Function to render values in before, after column of ag-grid table
     */
    private _cellRenderer(cellData: Array<any>, field: string) {
        if (cellData.length > 0) {
            let newVal = '';
            if (cellData.length > 1) {
                newVal = cellData[0];
                newVal = newVal.length >= 9 ? `${newVal.substring(0, 8)} <i data-toggle="modal" data-target="#beforeafterModal" class="material-icons before-after">open_in_new</i>`
                    : `${newVal.trim()} <i data-toggle="modal" data-target="#beforeafterModal" class="material-icons before-after">open_in_new</i>`;
            } else {
                newVal = cellData[0];
                const tmp = document.createElement('div');
                tmp.innerHTML = newVal;
                newVal = tmp.textContent || tmp.innerText || '';
                if (tmp.getElementsByTagName('img').length > 0) {
                    newVal = newVal.length >= 9 ? `${newVal.trim().substring(0, 8)} <i data-toggle="modal" data-target="#beforeafterModal" class="material-icons expand before-after">open_in_new</i>`
                        : `${newVal.trim()} <i data-toggle="modal" data-target="#beforeafterModal" class="material-icons before-after">open_in_new</i>`;
                } else {
                    newVal = newVal.length >= 9 ? `${newVal.trim().substring(0, 8)} <i data-toggle="modal" data-target="#beforeafterModal" class="material-icons before-after">open_in_new</i>` : newVal;
                }
            }
            return newVal;
        } else {
            return '';
        }
    }


    /**
         * @author David Raja <david.ra@pitsolutions.com>
         *
         * @param data
         *
         * Function to render html
         */
    private showModal(data) {
        let beforeVal = ''; let afterVal = '';
        const before = !!data['before'] ? data['before'] : '';
        const after = !!data['after'] ? data['after'] : '';
        if (before.length > 0 || after.length > 0) {
            if (before.length > 1 || after.length > 1) {
                if (before.length > 0) {
                    for (let i = 0; i < before.length; i++) {
                        let bfVal = before[i];
                        bfVal = bfVal + '<br>';
                        beforeVal += bfVal;
                    }
                }
                if (after.length > 0) {
                    for (let i = 0; i < after.length; i++) {
                        let afVal = after[i];
                        afVal = afVal + '<br>';
                        afterVal += afVal;
                    }
                }
            } else {
                if (before.length > 0) {
                    const bfVal = before[0];
                    beforeVal = bfVal;
                }
                if (after.length > 0) {
                    const afVal = after[0];
                    afterVal = afVal;
                }
            }
        }
        this.beforeVal = this._sanitizer.bypassSecurityTrustHtml(beforeVal);
        this.afterVal = this._sanitizer.bypassSecurityTrustHtml(afterVal);
    }

    /**
     * @author Niphy Anto <niphy.ao@pitsolutions.com>
     *
     * Function to format dateformat
     *
     * @param data
     */
    private _formatDate(data: Array<Object>): Array<Object> {
        if (!!data) {
            const formatedData: Array<Object> = data.map((item, index) => {
                const modifiedDate = this._dateFormatPipe.transform(item['modified_on']);
                item['modified_on'] = modifiedDate;
                return item;
            });
            return formatedData;
        } else {
            return null;
        }
    }

    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to initialize grid list
     */
    private _gridInitialize(): void {
        this.gridOptions = <GridOptions>{
            components: {
                actionCellRenderer: this._actionCellRenderer,
                fieldCellRenderer: this._fieldCellRenderer,
                beforeAfterCellRenderer: this._beforeAfterCellRenderer,
            },
            icons: {
                sortAscending: '<i class="material-icons icon-18 icon-sort-asc">keyboard_arrow_down</i>',
                sortDescending: '<i class="material-icons icon-18 icon-sort-desc">keyboard_arrow_up</i>',
            },
            columnDefs: this._columnDefs(),
            debug: false,
            floatingFilter: false,
            enableServerSideSorting: true,
            enableServerSideFilter: true,
            enableColResize: true,
            rowBuffer: 0,
            rowSelection: 'single',
            rowDeselection: true,
            rowModelType: 'infinite',
            cacheOverflowSize: 1,
            cacheBlockSize: 25,
            maxBlocksInCache: 50,
            maxConcurrentDatasourceRequests: 1,
            paginationPageSize: 25,
            animateRows: false,
            rowHeight: 25,
            onGridReady: this._gridReadyFunction,
            onViewportChanged: function (params) {
                params.api.sizeColumnsToFit();
            },
            onCellClicked: this._cellClickedFunction,
            suppressContextMenu: true,
        };
    }

    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param params
     *
     * Function to update grid on Grid Ready
     */
    private _gridReadyFunction(params: Object) {
        if (!params) {
            return null;
        }
        that._updateAgGridWithDataFromStore(params);
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
        if (columnName === 'before' || columnName === 'after') {
            const data = params.data;
            that.showModal(data);
        }
    }

    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param gridOptions
     *
     * Function to update The AgGrid With Data From Store
     */
    private _updateAgGridWithDataFromStore(gridOptions: GridOptions): void {
        if (!gridOptions['api']) {
            return null;
        }
        const dataSource = {
            rowCount: null,
            getRows: (params) => {
                this._page_size = params.startRow / 25;
                const sort_order = (params.sortModel.length > 0) ? params.sortModel['0'].sort.toUpperCase() : '';
                const sort_by = (params.sortModel.length > 0) ? 'modified_on' : '';
                const payload = {
                    document_id: this.documentId,
                    start_page: ++this._page_size,
                    count: 25,
                    sort_by: sort_by,
                    sort_order: sort_order,
                    actions: this._actions,
                    params: params
                };
                if (this._page_size === 1) { that._historyService.changePayload(payload); }
                that._historyActions.fetchHistoryData(payload);
            }
        };
        gridOptions.api.setDatasource(dataSource);
    }

    /**
     * @author Niphy Anto <niphy.ao@pitsolutions.com>
     *
     * Function to reload ag-grid table values while chosing checkbox in filter
     */
    public onChange(action, model: FormGroup): void { // modified by David on [4/4/2018] for displaying checkbox selected while loading
        if (!model.value.state) {
            this._actions = this._actions.filter(order => order !== action.id);
        } else {
            this._actions.push(action.id);
        }
        this._page_size = 0;
        that._updateAgGridWithDataFromStore(this.gridOptions);
    }

    public showHandoverHistory(data) {
        this.handoverDescription = data;
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
        this.listHistoryData = {};
    }

}

