import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { ICellEditorAngularComp } from 'ag-grid-angular';

import { AttachmentsService } from './../../../services';

@Component({
    selector: 'app-category-editor',
    templateUrl: './category-editor.component.html',
    styleUrls: ['./category-editor.component.scss']
})
export class CategoryEditorComponent implements ICellEditorAngularComp, OnInit, OnDestroy {
    private _params;
    private _parent;

    public gridApi;
    public gridOptions: GridOptions;

    constructor(private attachmentsService: AttachmentsService) { }

    ngOnInit() { }

    agInit(params: any): void {
        this._params = params;
        this._parent = this._params['context']['parent'];
        this.gridOptions = <GridOptions>{
            icons: {
                groupExpanded: '<i class="material-icons">keyboard_arrow_down</i>',
                groupContracted: '<i class="material-icons">keyboard_arrow_right</i>'
            },
            rowData: [],
            columnDefs: this._columnDefs(),
            autoGroupColumnDef: this._autoGroupColumnDef(),
            rowSelection: 'single',
            groupDefaultExpanded: -1,
            overlayNoRowsTemplate: ' ',
            treeData: true,
            floatingFilter: true,
            suppressContextMenu: true,
            toolPanelSuppressSideButtons: true,
            isRowSelectable: (node) => node['data']['type_id'] === 2,
            getDataPath: (data) => data['unique_path'].split('/'),
            onGridReady: this._onGridReadyFunction.bind(this),
            onSelectionChanged: this._onSelectionChangedFunction.bind(this)
        };
    }

    private _columnDefs() {
        return [{
            headerName: 'id',
            field: 'id',
            editable: true,
            hide: true
        }];
    }

    private _onSelectionChangedFunction(): void {
        this._params['api'].stopEditing();
    }

    private _autoGroupColumnDef() {
        return {
            headerName: 'Name',
            field: 'name',
            tooltip: (node) => node['data']['name'] ? node['data']['name'] : '',
            editable: true,
            width: 250,
            filter: 'agTextColumnFilter',
            cellClassRules: { 'disabled': (node) => node['data']['type_id'] === 1 },
            cellRendererParams: {
                suppressCount: true
            }
        };
    }

    private _onGridReadyFunction(params): void {
        this.gridApi = params['api'];
        this.gridApi.sizeColumnsToFit();
        this.attachmentsService.getCategoriesList().subscribe((res) => {
            const data = res[this._params['column']['colId']]['list'];
            this.gridApi.setRowData(data.filter((res) => res['status_id'] === 1));
        });
    }

    getValue(): any {
        const checkPermission = !this.gridApi
            || !!this.attachmentsService.allDisable
            || !!this.attachmentsService.addDisable
            || !this.attachmentsService.permissions['2'];
        const Value = this._params['value'];
        if (checkPermission) {
            return Value;
        }
        const selectedNodes = this.gridApi.getSelectedNodes();
        let a = this._params['value'];
        if (selectedNodes.length) {
            const dataArray = this._params['value'];
            const index = dataArray.indexOf(selectedNodes[0]['data']['id']);
            if (index > -1) {
                dataArray.splice(index, 1);
                a = !!dataArray.length ? dataArray : [];
            } else {
                a = [...this._params['value'], selectedNodes[0]['data']['id']];
            }
        } else {
            return Value;
        }
        return Array.from(new Set(a));
    }

    isPopup(): boolean {
        return true;
    }

    ngOnDestroy() { }

}
