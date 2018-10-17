import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ATTACHMENT_STATUS, ATTACHMENT_SYSTEM_STATUS } from './../constants';
import { AttachmentsService } from './attachments.service';

@Injectable()
export class AttachmentsTreeGridService {

    constructor(private _translate: TranslateService, private _attachmentsService: AttachmentsService) { }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Funtion return column def
     */
    public getColumnDefs() {
        return [
            {
                headerName: 'dummy_id',
                field: 'dummy_id',
                sort: 'desc',
                hide: true
            },
            {
                headerName: 'id',
                field: 'id',
                sort: 'desc',
                hide: true
            },
            {
                headerName: this._translate.instant('attachments.description'),
                field: 'description',
                tooltip: this._getToolTip,
                editable: (params) => !this.checkEditable(),
                suppressMenu: true,
                suppressFilter: true,
                cellEditor: 'InputCellEditor',
                cellEditorParams: {
                    maxLength: 500
                }
            },
            {
                headerName: this._translate.instant('attachments.status'),
                field: 'status_id',
                width: 120,
                editable: params => params.data.type_id === 2 && !this.checkEditable(),
                suppressMenu: true,
                suppressFilter: true,
                aggFunc: 'stat',
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: { values: [1, 2, 3] },
                tooltip: (params) => !!params.value ? this._translate.instant(`attachments.status_list.${ATTACHMENT_STATUS[params.value]}`) : '',
                valueFormatter: (params) => !!params.value ? this._translate.instant(`attachments.status_list.${ATTACHMENT_STATUS[params.value]}`) : ''
            },
            {
                headerName: this._translate.instant('attachments.system_status'),
                field: 'system_status_id',
                editable: false,
                suppressMenu: true,
                suppressFilter: true,
                cellClassRules: { 'cell-red': (params) => params.value === 1 },
                tooltip: (params) => !!params.value ? this._translate.instant(`attachments.system_status_list.${ATTACHMENT_SYSTEM_STATUS[params.value]}`) : '',
                valueFormatter: (params) => !!params.value ? this._translate.instant(`attachments.system_status_list.${ATTACHMENT_SYSTEM_STATUS[params.value]}`) : ''
            },
            {
                headerName: this._translate.instant('attachments.size'),
                field: 'size',
                width: 150,
                tooltip: this._sizeValueFormatter,
                aggFunc: 'sum',
                editable: false,
                suppressMenu: true,
                suppressFilter: true,
                valueFormatter: this._sizeValueFormatter.bind(this)
            },
            {
                headerName: this._translate.instant('attachments.created'),
                field: 'created.on',
                editable: false,
                suppressMenu: true,
                suppressFilter: true,
                cellRenderer: 'dateCellRenderer'
            },
            {
                headerName: this._translate.instant('attachments.edited'),
                field: 'edited.on',
                editable: false,
                suppressMenu: true,
                suppressFilter: true,
                cellRenderer: 'dateCellRenderer'
            },
            {
                headerName: this._translate.instant('attachments.added'),
                field: 'added.on',
                editable: false,
                suppressMenu: true,
                suppressFilter: true,
                cellRenderer: 'dateCellRenderer'
            },
            {
                headerName: this._translate.instant('attachments.extension'),
                field: 'extension',
                width: 150,
                tooltip: this._getToolTip,
                editable: false,
                suppressMenu: true,
                suppressFilter: true,
                cellRenderer: 'extensionCellRenderer'
            },
            {
                headerName: this._translate.instant('attachments.uid'),
                field: 'id',
                width: 100,
                tooltip: this._getToolTip,
                editable: false,
                suppressMenu: true,
                suppressFilter: true,
            },
            {
                headerName: this._translate.instant('attachments.categories_private'),
                field: 'private_categories',
                editable: (params) => !this.checkEditable(),
                suppressMenu: true,
                suppressFilter: true,
                cellEditor: 'categoryEditor',
                cellRenderer: 'categoryCellRenderer'
            },
            {
                headerName: this._translate.instant('attachments.categories_public'),
                field: 'public_categories',
                editable: (params) => !this.checkEditable(),
                suppressMenu: true,
                suppressFilter: true,
                cellEditor: 'categoryEditor',
                cellRenderer: 'categoryCellRenderer'
            }
        ];
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Funtion return autoGroupColumnDef
     */
    public getAutoGroupColumnDef() {
        return {
            headerName: this._translate.instant('attachments.name'),
            field: 'name',
            width: 250,
            // tooltip: this._getToolTip,
            suppressMenu: true,
            suppressFilter: true,
            editable: (params) => !this.checkEditable(),
            headerCheckboxSelection: true,
            checkboxSelection: true,
            valueSetter: this._validatePermission.bind(this),
            cellRendererParams: {
                padding: 25,
                suppressCount: true,
                innerRenderer: 'fileCellRenderer',
            },
            cellEditor: 'InputCellEditor',
            cellEditorParams: {
                maxLength: 255
            }
        };
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Funtion return name for tooltip
     * @param params
     */
    private _getToolTip(params: object): string {
        const column = params['colDef']['field'];
        const nodeData = params['node']['data'];
        return !!nodeData ? nodeData[column] : ''
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Funtion return size based on bytes
     * @param params
     */
    private _sizeValueFormatter(params: any): string {
        return Math.round(params.value / Math.pow(2, 30)) >= 1
            ? `${Math.round(params.value / Math.pow(2, 30))} GB`
            : Math.round(params.value / Math.pow(2, 20)) >= 1
                ? `${Math.round(params.value / Math.pow(2, 20))} MB`
                : Math.round(params.value / Math.pow(2, 10))
                    ? `${Math.round(params.value / 1024)} KB`
                    : '0 KB';
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Funtion validate permission
     * @param params
     */
    private _validatePermission(params: object): boolean {
        params['data']['name'] = !params['newValue'] ? params['oldValue'] : params['newValue'];
        return !!params['data']['name'] && (params['oldValue'] !== params['newValue'])
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Funtion return file icon
     * 
     * @param value
     * @param type_id
     */
    public getFileIcon(value: string, type_id: number): string {
        const [name, extension] = value.split(/\.(?=[^\.]+$)/);
        let extensionPath = 'unknown_file';
        const extensionArray = ["AI", "AVI", "EPS", "GIF", "HTML", "JPG", "MOV", "MP3", "MP4", "OBJ", "PDF", "PHP", "PNG", "PSD", "TXT", "XLS", "ZIP"];
        if (!!extension && !!extensionArray.find(val => val === extension.toUpperCase())) {
            extensionPath = extension.toLowerCase();
        }
        return (type_id === 1) ? 'folder' : extensionPath;
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Funtion check grid editable or not
     */
    public checkEditable(): boolean {
        return !!this._attachmentsService.allDisable || !!this._attachmentsService.addDisable || !this._attachmentsService.permissions['2']
    }

}
