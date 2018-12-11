import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';

import { Router, ActivatedRoute } from '@angular/router';
import { SharedStorageService } from './../../../../core/services/index';



@Component({
    selector: 'app-ag-grid-sorting-header',
    templateUrl: './ag-grid-sorting-header.component.html',
    styleUrls: ['./ag-grid-sorting-header.component.scss']
})
export class AgGridSortingHeaderComponent implements OnInit, OnDestroy {

    public params: any;

    constructor(
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private sharedStorageService: SharedStorageService
    ) { }

    ngOnInit() { }

    public agInit(params: any): void {
        this.params = params;
        this.params.displayName = !!params.displayName ? params.displayName : params.data.key;
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function calls when clicks on header name.
     *
     * @param columnId
     * @param params
     */
    public onSortRequested(columnId, params): void {
        if (params.enableSorting) {
            const currentSortModel = params['api'].getSortModel();
            const sort_by = currentSortModel.length && currentSortModel[0]['colId'];
            const sort_order = currentSortModel.length && currentSortModel[0]['sort'];
            const sortModel = [
                {
                    colId: columnId,
                    sort: columnId === sort_by ? sort_order === 'desc' ? 'asc' : '' : 'desc'
                }
            ];
            params['api'].setSortModel(sortModel);
        }
    }


    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function calls when clicks on header name.
     *
     * @param params
     */
    getSortOrder(params: any) {
        const currentSortModel = params['api'].getSortModel();
        const sort_by = currentSortModel.length && currentSortModel[0]['colId'];
        const sort_order = currentSortModel.length && currentSortModel[0]['sort'];
        return (params.column.getColId() === sort_by) ? sort_order : 'default';
    }


    /**
     * Called once, before the instance is destroyed.
     *
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     */
    ngOnDestroy() {
        this.params = null;
    }

}
