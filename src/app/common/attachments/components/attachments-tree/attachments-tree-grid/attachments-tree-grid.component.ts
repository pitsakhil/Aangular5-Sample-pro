import * as _ from 'lodash';

import { GridOptions } from 'ag-grid';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { AttachmentUrls, ClickActions, API_ACTIONS } from '../../../constants';
import { AttachmentsActions } from './../../../store';
import { AttachmentsTreeGrid } from './../../../models';
import { DateFormatPipe } from './../../../../shared/pipes/date-format.pipe';
import { MetadataActions } from './../../../../shared/store/metadata.actions';
import { ApiService } from './../../../../../core/services';
import { AttachmentsService, AttachmentsTreeGridService } from './../../../services';
import { CategoryEditorComponent } from './../category-editor/category-editor.component';
import { NotificationService } from './../../../../notification/services/notification.service';
import { startUpload, onTriggerCancel } from '../../file-uploader/file-uploader.component';
import { FileUploaderService } from '../../../services/uploader.service';

import { skip, throttleTime } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

let that: any;

@Component({
    selector: 'app-attachments-tree-grid',
    templateUrl: './attachments-tree-grid.component.html',
    styleUrls: ['./attachments-tree-grid.component.scss']
})
export class AttachmentsTreeGridComponent implements OnInit, OnDestroy {
    public gridApi;
    public gridOptions: GridOptions;
    public attachmentsTreeGrid: AttachmentsTreeGrid;
    private _subscriptions = new Subscription();

    constructor(
        private _apiService: ApiService,
        private _translate: TranslateService,
        private _attachmentsService: AttachmentsService,
        private _attachmentsActions: AttachmentsActions,
        private _metadataActions: MetadataActions,
        private _notificationService: NotificationService,
        private _attachmentsTreeGridService: AttachmentsTreeGridService,
        private _uploader: FileUploaderService
    ) { }

    ngOnInit() {
        this._init();
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * function to define all initial activities
     */
    private _init(): void {
        this._initVariables();
        this._gridInitialize();
        this._fetchCategoriesList();
        this._fetchAttachmentList();
        this._onUpdateRowData();
        this._listenUpload();
        this._listenUploadCancel();
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Initialize component variables
     */
    private _initVariables(): void {
        that = this;
        const categoryList = !!this.attachmentsTreeGrid ? this.attachmentsTreeGrid['categoryList'] : [];
        this.attachmentsTreeGrid = <AttachmentsTreeGrid>{
            reference: {},
            dummy_id: 0,
            editStopped: true,
            beforeNodeData: null,
            beforeNodeDataValid: null,
            currentNodeParams: null,
            sf_id: this._attachmentsService.sf_id,
            components: { InputCellEditor: getInputCellEditor(), fileCellRenderer: getFileCellRenderer(), extensionCellRenderer: getExtensionCellRenderer, dateCellRenderer: getDateCellRenderer, categoryCellRenderer: getCategoryCellRenderer },
            frameworkComponents: { categoryEditor: CategoryEditorComponent },
            icons: {
                sortAscending: '<i class="material-icons icon-18 icon-sort-asc">keyboard_arrow_up</i>',
                sortDescending: '<i class="material-icons icon-18 icon-sort-desc">keyboard_arrow_down</i>',
                groupExpanded: '<i class="material-icons">keyboard_arrow_down</i>',
                groupContracted: '<i class="material-icons">keyboard_arrow_right</i>'
            },
            aggFuncs: { stat: statAggFunction },
            attachments: [],
            files: [],
            fileNames: [],
            categoryList: categoryList
        };
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Initialize grid
     */
    private _gridInitialize(): void {
        this.gridOptions = <GridOptions>{
            columnDefs: this._attachmentsTreeGridService.getColumnDefs(),
            autoGroupColumnDef: this._attachmentsTreeGridService.getAutoGroupColumnDef(),
            rowData: [],
            rowSelection: 'multiple',
            sortingOrder: ['desc', 'asc', null],
            groupDefaultExpanded: -1,
            context: { parent: this },
            treeData: true,
            animateRows: true,
            enableSorting: true,
            rowDeselection: true,
            enableColResize: true,
            suppressClickEdit: true,
            suppressContextMenu: true,
            suppressNoRowsOverlay: true,
            toolPanelSuppressSideButtons: true,
            isRowSelectable: (node) => !!node['data'],
            getDataPath: (data) => data.unique_path.split('/'),
            onCellEditingStarted: this._onCellEditingStarted.bind(this),
            onCellValueChanged: this._onCellValueChanged.bind(this),
            onCellDoubleClicked: this._onCellDoubleClicked.bind(this),
            onCellClicked: this._onCellClicked.bind(this),
            onSortChanged: this._onSortChanged.bind(this),
            onGridReady: this._onGridReadyFunction.bind(this)
        };
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function trigger when cell editing started
     * @param params
     */
    private _onCellEditingStarted(params: any): any {
        this.attachmentsTreeGrid.currentNodeParams = params;
        if (!this._attachmentsService.editClick || !this.attachmentsTreeGrid.beforeNodeData) {
            this.attachmentsTreeGrid.beforeNodeDataValid = JSON.stringify(params['node']['data']);
            this.attachmentsTreeGrid.beforeNodeData = JSON.stringify(params['node']['data']);
        }
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function trigger when cell editing stopped
     * @param params
     */
    private _onCellValueChanged(params: any): any {
        if (!params || !this.attachmentsTreeGrid.beforeNodeData) {
            return;
        }

        const newValue = params['newValue'];
        const oldValue = params['oldValue'];
        const checkValueInValid = ('newValue' in params) && !newValue && !oldValue;
        const checkValueChange = !!newValue && !!oldValue && (newValue === oldValue) && (params['column']['getId']() !== 'ag-Grid-AutoColumn');
        if (!this._attachmentsService.saveClick && (checkValueInValid || checkValueChange)) {
            if (!this._attachmentsService.editClick) {
                return this._clearBeforeNodeData();
            }
        }

        if (!!this._attachmentsService.allDisable || !!this._attachmentsService.addDisable || !this._attachmentsService.permissions['2'] || !!this._attachmentsService.editCancel) {
            const paramNode = JSON.parse(this.attachmentsTreeGrid.beforeNodeData);
            params['node'].setData(paramNode);
            const oldData = updateUniquePath(params.node, paramNode['name']);
            this.gridApi.updateRowData({ update: oldData });
            this._attachmentsService.editCancel = false;
            this._attachmentsService.editClick = false;
            this._clearBeforeNodeData();
            this._setPayloadData();
            return;
        }

        const column = params['column'];
        if (!!column && (column.getId() === 'ag-Grid-AutoColumn') && !this._validateNodeName(params)) {
            return;
        }

        const nodeName = !!params['data']['name'] ? params['data']['name'] : JSON.parse(this.attachmentsTreeGrid.beforeNodeData)['name'];
        const updateData = (params.column.getId() === 'ag-Grid-AutoColumn') ? updateUniquePath(params.node, nodeName) : [params['node']['data']];
        if (!!params['node']['data']['id'] && !this._attachmentsService.editClick) {
            this._updateRowNodes(this._attachmentsService.sf_id, params['node']['data'], updateData);
            this._attachmentsService.saveClick = false;
            this._clearBeforeNodeData();
        } else {
            this.gridApi.updateRowData({ update: updateData });
            if (!this._attachmentsService.editClick) {
                this._attachmentsService.saveClick = false;
                this._clearBeforeNodeData();
                this._notificationService.success('success', this._translate.instant('notification.attachementsupdated'));
            }
        }
        this._setPayloadData();
        this.gridApi.refreshClientSideRowModel('aggregate');
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to clear before node data value
     */
    private _clearBeforeNodeData(): void {
        this.attachmentsTreeGrid.beforeNodeData = null;
        this.attachmentsTreeGrid.beforeNodeDataValid = null;
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function validate name
     * @param params
     */
    private _validateNodeName(params?: object): boolean {
        if (!params['node']) {
            this._attachmentsService.nameAfterEdit = this.attachmentsTreeGrid.beforeNodeDataValid = this.attachmentsTreeGrid.beforeNodeData = null;
            return;
        }

        const goBack = () => {
            params['node']['data']['name'] = paramNode['name'];
            this.gridApi.refreshCells({ force: true });
            this.attachmentsTreeGrid.beforeNodeData = !!this._attachmentsService.editClick ? this.attachmentsTreeGrid.beforeNodeData : null;
            this.attachmentsTreeGrid.beforeNodeDataValid = this.attachmentsTreeGrid.beforeNodeData;
            return false;
        };

        const paramNode = JSON.parse(this.attachmentsTreeGrid.beforeNodeDataValid);
        const [beforeNameValue, beforeExtensionValue] = params['node']['data']['unique_path'].split('/')[params['node']['level']].split(/\.(?=[^\.]+$)/);
        const [afterNameValue, afterExtensionValue] = params['node']['data']['name'].split(/\.(?=[^\.]+$)/);
        const data = params['data'];
        if (!!data['name'].match(/[#%&{}\\><*?\/$!':"@]/)) {
            this._notificationService.error('error', this._translate.instant('notification.attachmentsSpecialCharacter'));
            return goBack();
        } else {
            const rowcount = this.gridApi.getModel().getRowCount() - 1;
            for (let i = rowcount; i >= 0; i--) {
                const node = this.gridApi.getDisplayedRowAtIndex(i);
                const levelCheck = params['node']['level'] === node['level'];
                const nameCheck = data['name'].toUpperCase() === node['data']['name'].toUpperCase();
                const idCheck = (!!data['id'] && data['id'] === node['data']['id']) || (!!data['dummy_id'] && data['dummy_id'] === node['data']['dummy_id']);
                const parentCheck = params['node']['level'] ? node['parent']['data'] ? node['parent']['data']['unique_path'] === params['node']['parent']['data']['unique_path'] : false : true;
                if (parentCheck && levelCheck && nameCheck && !idCheck) {
                    this._notificationService.error('error', this._translate.instant('notification.attachmentsfilenameexist'));
                    i = -1;
                    return goBack();
                }
            }
        }

        if (!this._attachmentsService.nameAfterEdit && params['node']['data']['type_id'] === 2 && `s${beforeExtensionValue}`.toUpperCase() !== `s${afterExtensionValue}`.toUpperCase()) {
            this._attachmentsService.nameAfterEdit = params['node']['data']['name'];
            this._attachmentsService.popUpTitle = 'attachmentsextension_valid';
            Array.from(document.getElementsByClassName('attachment-popup'))[0]['click']();
            return false;
        } else if (!!this._attachmentsService.nameAfterEdit) {
            const node_data = JSON.parse(this.attachmentsTreeGrid.beforeNodeDataValid);
            node_data['name'] = this._attachmentsService.nameAfterEdit;
            this.attachmentsTreeGrid.beforeNodeDataValid = JSON.stringify(node_data);
        }

        return true;
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function trigger when grid is ready
     * @param params
     */
    private _onGridReadyFunction(params: any): void {
        if (!params || !params['api']) {
            return;
        }
        this.gridApi = this.gridOptions['api'];
        this._attachmentsService.attachmentTreeGridOptions = params;
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function trigger when cell is clicked
     * @param params
     */
    private _onCellClicked(params: any): void {
        if (this._attachmentsService.editClick) {
            const nodeData = this._attachmentsService.editNodeData;
            const checkId = !!params['data']['id'] && (params['data']['id'] === nodeData['id'])
            const checkDummyId = !!params['data']['dummy_id'] && (params['data']['dummy_id'] === nodeData['dummy_id']);
            if (checkId || checkDummyId) {
                this.attachmentsTreeGrid.currentNodeParams = params;
                this.gridApi.startEditingCell({ rowIndex: params.rowIndex, colKey: params.column.getColId() });
            }
        }
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function trigger when sort changed
     * @param params
     */
    private _onSortChanged(params: any): void {
        if (params['api'].getSortModel().length === 0) {
            const sortModel1 = [{ colId: 'id', sort: 'desc' }];
            params['api'].setSortModel(sortModel1);
            params.columnApi.getColumn('dummy_id').setSort('desc');
            params['api'].refreshClientSideRowModel('filter');
        }
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function trigger when cell is double clicked
     * @param params
     */
    private _onCellDoubleClicked(params: any): void {
        if (!this._attachmentsService.editClick) {
            this.gridApi.startEditingCell({ rowIndex: params.rowIndex, colKey: params.column.getId() });
        }
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function trigger when row data update available
     * @param params
     */
    private _onUpdateRowData(): void {
        this._subscriptions.add(
            this._attachmentsService.onUpdateRowData()
                .pipe(skip(1))
                .subscribe((res) => {
                    if (!res) { return; }
                    const action = res['action'];
                    this.attachmentsTreeGrid.deleteIds = [];
                    switch (action) {
                        case ClickActions.ADD:
                            return this._addRowNodesByType(res['type_id'], res['fileInput']);
                        case ClickActions.DELETE:
                            this.attachmentsTreeGrid = Object.assign(this.attachmentsTreeGrid, { deleteIds: [] });
                            this._attachmentsService.editClick = false;
                            return this._removeRowNodesByType(this.gridApi.getSelectedNodes()[0]);
                        case ClickActions.MAIN_UPDATE:
                            return this._saveRowNodes(API_ACTIONS.EDIT, res['sf_id'], this.attachmentsTreeGrid.attachments);
                        case ClickActions.MAIN_ADD:
                            return this._saveRowNodes(API_ACTIONS.ADD, res['sf_id'], this.attachmentsTreeGrid.attachments);
                        case ClickActions.UPDATE:
                            return (this.gridApi.getEditingCells().length === 0) ? this._onCellValueChanged(this.attachmentsTreeGrid.currentNodeParams) : this.gridApi.stopEditing();
                        case ClickActions.EXTENSION_CONFIRM:
                            this.attachmentsTreeGrid.currentNodeParams['node']['data']['name'] = this._attachmentsService.nameAfterEdit;
                            return this._onCellValueChanged(this.attachmentsTreeGrid.currentNodeParams);
                        case ClickActions.DOWNLOAD:
                            return this._downloadAttachment(this.gridApi.getSelectedNodes());
                    }
                })
        );
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     * 
     * Function to listen upload to update progress in grid
     */
    private _listenUpload(): void {
        this._subscriptions.add(
            this._uploader.queue.pipe(throttleTime(500)).subscribe((items) => {
                const gridApi = this.gridApi;
                if (!gridApi || !items.length) { return; }
                const itemcount = items.length - 1;
                for (let j = itemcount; j >= 0; j--) {
                    const data = items[j];
                    const node = this._getRowNode(gridApi, data['file']['unique_path']);
                    if (node) {
                        node['data'].progress = data.progress ? data.progress : data.isError() ? 100 : -1;
                        j === 0 && gridApi.refreshCells({ force: true });
                    }
                }
            })
        );
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * functioon listen upload cancel
     */
    private _listenUploadCancel(): void {
        this._subscriptions.add(
            onTriggerCancel.subscribe((res) => {
                if (!res || !res['file']) { return; }
                const dummy_id = res['file']['dummy_id'];
                this.gridApi.forEachNode((node) => {
                    if (node['data']['dummy_id'] === dummy_id) {
                        this._deleteAttachments(this._attachmentsService.sf_id, [], node['data']['unique_path'], false, { item: res, nodeData: node['data'] });
                        return;
                    }
                });
            })
        );
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * fetch attachment list from store
     */
    private _fetchAttachmentList(): void {
        this._subscriptions.add(
            this._attachmentsService.getAttachmentsList()
                .pipe(skip(1))
                .subscribe((res) => {
                    const data = res['attachmentsList'];
                    if (!data['list']) { return; }
                    if (!this.gridApi) {
                        debugger;
                        return !!this._attachmentsService.sf_id && this._attachmentsActions.fetchAttachmentsListData({ sf_id: this._attachmentsService.sf_id });
                    }
                    if (!!res['payload']['id']) {
                        this.gridApi.forEachNode((node) => {
                            if (node['data']['id'] === res['payload']['id']) {
                                node.setData(res['attachmentsList']['list'].filter((val) => val['id'] === res['payload']['id'])[0]);
                                this.gridApi.refreshClientSideRowModel('aggregate');
                                return;
                            }
                        });
                    } else {
                        this._initVariables();
                        this.attachmentsTreeGrid.reference = data['reference'];
                        this.gridApi.setRowData(data['list']);
                    }
                })
        );
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * fetch category list from store
     */
    private _fetchCategoriesList(): void {
        this._attachmentsService.getCategoriesList()
            .subscribe((res) => {
                this.attachmentsTreeGrid.categoryList = res;
                (this.gridApi) && this.gridApi.refreshCells({ force: true });
            });
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to save rownodes
     * @param params
     */
    private _saveRowNodes(action?: string, sf_id?: string, attachments?: Array<object>): void {
        if (!attachments.length || !sf_id) {
            return this._attachmentsService.attachmentSaved.emit('');
        }
        const body = { attachments: JSON.stringify(attachments), action: action };
        this._apiService.post(`${AttachmentUrls.ATTACHMENTS_MAIN_URL.replace('{sf_id}', sf_id)}`, body)
            .subscribe({
                next: (res) => {
                    this._uploader.clearQueue();
                    const filesCount = this.attachmentsTreeGrid.files.length;
                    this._attachmentsService.sf_id = sf_id;
                    if (!filesCount) {
                        this._attachmentsActions.fetchAttachmentsListData({ sf_id: sf_id });
                        return this._attachmentsService.attachmentSaved.emit(res);
                    }
                    for (let i = filesCount - 1; i >= 0; i--) {
                        const file = this.attachmentsTreeGrid.files[i];
                        const data = this.attachmentsTreeGrid.attachments.filter((attachment) => attachment['dummy_id'] === file['dummy_id']);
                        this.attachmentsTreeGrid.files[i]['file_name'] = !!data[0] ? data[0]['name'] : file['file_name'];
                        this.attachmentsTreeGrid.files[i]['unique_path'] = !!data[0] ? data[0]['unique_path'] : file['unique_path'];
                        this.attachmentsTreeGrid.files[i]['sf_id'] = sf_id;
                        if (i === 0) {
                            this._uploader.addToQueue(this.attachmentsTreeGrid.files);
                            this._attachmentsService.allDisable = true;
                            startUpload(this.attachmentsTreeGrid.files, res);
                            this._uploader.uploadAll();
                            this.attachmentsTreeGrid.files = [];
                        }
                    }
                }, error: (err: any) => {
                    this._notificationService.error('error', this._translate.instant('Something went wrong'));
                    throw err;
                }
            });
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to update rownodes
     * @param params
     */
    private _updateRowNodes(sf_id?: string, data?: object, updateData?: Array<object>): void {
        const body = {
            name: data['name'],
            description: data['description'],
            status_id: data['status_id'],
            system_status_id: data['system_status_id'],
            public_categories: data['public_categories'].toString(),
            private_categories: data['private_categories'].toString()
        };
        this._apiService.put(`${AttachmentUrls.ATTACHMENTS_MAIN_URL.replace('{sf_id}', sf_id)}/${data['id']}`, body)
            .subscribe({
                next: (res) => {
                    !!res['message'] && this._notificationService.success('success', res.message);
                    this.gridApi.updateRowData({ update: updateData });
                    this._attachmentsActions.fetchAttachmentsListData({ sf_id: sf_id, id: data['id'] });
                    this._metadataActions.fetchMetadata({ document_id: sf_id });
                }, error: (err: any) => {
                    this._notificationService.error('error', this._translate.instant('Something went wrong'));
                    this._attachmentsActions.fetchAttachmentsListData({ sf_id: sf_id });
                    throw err;
                }
            });
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to update rownodes
     * @param params
     */
    public _downloadAttachment(data?: any): void {
        let nodesToRemove = downloadAttachment(data)
        this._attachmentsActions.downloadAttachments(nodesToRemove);
    }


    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to add rownodes by type(folder||attachments)
     * @param params
     */
    private _addRowNodesByType(type_id?: number, fileInput?: any): void {
        if (!type_id || !fileInput) {
            return;
        }
        const rowNode = { 'progress': 0, 'description': '', 'type_id': type_id, 'status_id': 1, 'system_status_id': '', 'public_categories': [], 'private_categories': [] };
        const path = getUniquePath(this.gridApi);
        if (type_id === 1) {
            const name = this._getFolderNameAfterVersion();
            const dummy_id = ++this.attachmentsTreeGrid.dummy_id;
            Object.assign(rowNode, { name: name, dummy_id: dummy_id, unique_path: path + name });
            this.gridApi.updateRowData({ add: [JSON.parse(JSON.stringify(rowNode))] });
            this._setPayloadData();
        } else {
            const fileBrowser = fileInput.nativeElement;
            this.attachmentsTreeGrid.fileNames = [];
            Array.from(fileBrowser.files).forEach((file, i) => {
                let file_name = (!!file['type'] || !!file['name'].split(/\.(?=[^\.]+$)/)[1]) ? file['name'] : `${file['name']}.unknown`;
                if (file_name.length > 255) {
                    const extensionName = file_name.split(/\.(?=[^\.]+$)/)[1];
                    file_name = `${file_name.substr(0, 255 - extensionName.length - 1)}.${extensionName}`;
                }
                const [name, extension] = this._getFileNameAfterVersion(file_name);
                if (!!file_name.match(/[#%&{}\\><*?\/$!':"@]/)) {
                    this._attachmentsService.attachmentsInValid = true;
                    this._notificationService.error('error', this._translate.instant('notification.attachmentsSpecialCharacter'));
                }
                const size = file['size'];
                const dummy_id = ++this.attachmentsTreeGrid.dummy_id;
                const unique_path = `${path}${name}.${extension}`;
                file['file_name'] = `${name}.${extension}`;
                file['dummy_id'] = dummy_id;
                file['unique_path'] = unique_path;
                file = Object.assign(file, { dummy_id: dummy_id, unique_path: unique_path });
                Object.assign(rowNode, { name: `${name}.${extension}`, size: size, extension: extension, dummy_id: dummy_id, unique_path: unique_path });
                const existNode = this._getRowNode(this.gridApi, unique_path);
                if (existNode && existNode['data']['id']) {
                    const id = existNode['data']['id'];
                    this._deleteAttachments(this._attachmentsService.sf_id, [id], '', true);
                }
                this.gridApi.updateRowData({ add: [JSON.parse(JSON.stringify(rowNode))] });
                this._setPayloadData();
            });
            this.attachmentsTreeGrid.files = [...this.attachmentsTreeGrid.files, ...Array.from(fileBrowser.files)];
            this.attachmentsTreeGrid.files = _.uniqBy(this.attachmentsTreeGrid.files.reverse(), 'unique_path').reverse();
            fileInput.nativeElement.value = '';
        }
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function return node by unique_path
     * 
     * @param gridApi 
     * @param unique_path 
     */
    private _getRowNode(gridApi: any, unique_path: string): object {
        const rowcount = gridApi.getModel().getRowCount() - 1;
        for (let i = rowcount; i >= 0; i--) {
            const node = gridApi.getDisplayedRowAtIndex(i);
            if (node.data.unique_path === unique_path) {
                i = 0;
                return node;
            }
        }
        return null;
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to version file names
     */
    private _getFileNameAfterVersion(fileName): Array<string> {
        const [name, extension] = fileName.split(/\.(?=[^\.]+$)/);
        const selectedNodes = this.gridApi.getSelectedNodes();
        const nodeLevel = this._getNodeLevel(selectedNodes);
        const rowcount = this.gridApi.getModel().getRowCount() - 1;
        for (let i = rowcount; i >= 0; i--) {
            const node = this.gridApi.getDisplayedRowAtIndex(i);
            const selectedNodeData = !!nodeLevel ? selectedNodes[0]['data']['type_id'] === 2 ? selectedNodes[0]['parent']['data'] : selectedNodes[0]['data'] : {};
            const parentCheck = nodeLevel ? node['parent']['data'] ? node['parent']['data']['unique_path'] === selectedNodeData['unique_path'] : false : true;
            const checkLevel = node['level'] === nodeLevel;
            const checkTypeId = node['data']['type_id'] === 2;
            if (!!parentCheck && !!checkLevel && !!checkTypeId) {
                const file_name = node['data']['name'];
                const checkVersion = file_name.match(/\((v|V)\d+\)/g);
                const checkVersionExist = !checkVersion || (!!checkVersion && checkVersion.length === 1);
                const checkEqual = file_name.toUpperCase() === fileName.toUpperCase() || (file_name.replace(/(\((v|V)\d+\).)/g, '.').toUpperCase() === fileName.replace(/(\((v|V)\d+\).)/g, '.').toUpperCase());
                if (!!checkVersionExist && !!checkEqual) {
                    node['data']['status_id'] = 2;
                    node['data']['updated'] = true;
                    node['data']['system_status_id'] = 2;
                    this.attachmentsTreeGrid.fileNames.push(file_name);
                }
            }
        }
        let versionedName = fileName;
        if (this.attachmentsTreeGrid.fileNames.length) {
            const valueWithVersion = this.attachmentsTreeGrid.fileNames.filter((value) => !!value.match(/\((v|V)\d+\)./g));
            if (valueWithVersion.length) {
                const versionArray = valueWithVersion.map((res) => res.match(/\((v|V)\d+\)/)[0].match(/\d+/)[0]);
                const newVersionNumber = Math.max.apply(null, versionArray);
                versionedName = !!fileName.match(/\((v|V)\d+\)./g)
                    ? `${fileName.replace(/(\((v|V)\d+\).)/g, '(v' + (newVersionNumber + 1) + ').')}`
                    : `${name}(v${newVersionNumber + 1}).${extension}`;
            } else {
                versionedName = !!fileName.match(/\((v|V)\d+\)./g)
                    ? `${fileName.replace(/(\((v|V)\d+\).)/g, '(v1).')}`
                    : `${name}(v${1}).${extension}`;
            }
        }
        return versionedName.split(/\.(?=[^\.]+$)/);
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     * 
     * Function return node level based on selected node
     * 
     * @param selectedNodes 
     */
    private _getNodeLevel(selectedNodes: object[]): number {
        if (!selectedNodes.length) { return 0; }
        const level = selectedNodes[0]['level'];
        const data = selectedNodes[0]['data'];
        return data['type_id'] === 2 ? level : level + 1
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to version folder names
     */
    private _getFolderNameAfterVersion(): string {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const nodeLevel = (selectedNodes.length > 0) ? selectedNodes[0]['level'] + 1 : 0;
        const rowcount = this.gridApi.getModel().getRowCount() - 1;
        const folderNames = [];
        for (let i = rowcount; i >= 0; i--) {
            const node = this.gridApi.getDisplayedRowAtIndex(i);
            const parentCheck = nodeLevel ? node['parent']['data'] ? node['parent']['data']['unique_path'] === selectedNodes[0]['data']['unique_path'] : false : true;
            if (parentCheck && nodeLevel === node['level'] && node['data']['type_id'] === 1) {
                folderNames.push(node['data']['name']);
            }
        }
        const newName = `New Folder`;
        let count = 0;
        const check = (name) => {
            if (folderNames.filter((val) => val.toUpperCase() === name.toUpperCase()).length > 0) {
                ++count;
                return check(`${newName}(${count})`);
            } else {
                return name;
            }
        };
        return check(newName);
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to remove rownodes
     * @param selectedNode
     */
    private _removeRowNodesByType(selectedNode?: any): void {
        if (!selectedNode) {
            if (this.attachmentsTreeGrid.deleteIds.length > 0) {
                this._deleteAttachments(this._attachmentsService.sf_id, this.attachmentsTreeGrid.deleteIds);
            } else {
                this._notificationService.success('success', this._translate.instant('notification.attachmentsdeleted'));
            }
            console.warn('No nodes selected!');
            return;
        }
        const nodesToRemove = getRowsToRemove(selectedNode);
        nodesToRemove.forEach((data) => {
            !!data['id'] && this.attachmentsTreeGrid.deleteIds.push(data['id']);
            this.attachmentsTreeGrid.files = this.attachmentsTreeGrid.files.filter(res => res['dummy_id'] !== data['dummy_id']);
        });
        this.gridApi.updateRowData({ remove: nodesToRemove });
        this._updateOldRevision(selectedNode);
        this._setPayloadData();
        this._removeRowNodesByType(this.gridApi.getSelectedNodes()[0]);
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to update old revision to blank when delete latest version of a file
     *
     * @param selectedNode
     */
    private _updateOldRevision(selectedNode?: object): void {
        const { data, name, level, parent } = { data: selectedNode['data'], name: selectedNode['data']['name'], level: selectedNode['level'], parent: selectedNode['parent'] };
        const rowcount = this.gridApi.getModel().getRowCount() - 1;
        if (!!name.match(/(\((v|V)\d+\).)/g) && !data['system_status_id']) {
            let latestVersion = 0;
            let latestNode = null;
            for (let i = rowcount; i >= 0; i--) {
                const node = this.gridApi.getDisplayedRowAtIndex(i);
                const parentCheck = level ? parent['data'] ? parent['data']['unique_path'] === data['unique_path'] : false : true;
                const checkLevel = node['level'] === level;
                const checkTypeId = node['data']['type_id'] === 2;
                if (!!parentCheck && !!checkLevel && !!checkTypeId) {
                    const file_name = node['data']['name'];
                    const checkVersion = file_name.match(/\((v|V)\d+\)/g);
                    const checkEqual = file_name.toUpperCase() === name.toUpperCase() || (file_name.replace(/(\((v|V)\d+\).)/g, '.').toUpperCase() === name.replace(/(\((v|V)\d+\).)/g, '.').toUpperCase());
                    if (!!checkEqual) {
                        const version = checkVersion ? file_name.match(/\((v|V)\d+\)/)[0].match(/\d+/)[0] : 0;
                        if (latestVersion <= version) {
                            latestVersion = version;
                            latestNode = node;
                        }
                    }
                }
                if (i === 0) {
                    if (latestNode) {
                        const status_id = latestNode.data['status_id'];
                        Object.assign(latestNode.data, { status_id: status_id === 2 ? 1 : status_id, system_status_id: '' });
                        (latestNode['data']['id'])
                            ? this._updateRowNodes(this._attachmentsService.sf_id, latestNode['data'], [latestNode.data])
                            : this.gridApi.updateRowData({ update: [latestNode.data] });
                    }
                }
            }
        }
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to delete attachments by ids(soft delete) or unique_path(hard delete when cancel upload)
     *
     * @param sf_id
     * @param ids
     * @param unique_path
     */
    private _deleteAttachments(sf_id?: string, ids?: Array<number>, unique_path?: string, skipNotify?: boolean, cancelOptions?: any): void {
        if (!sf_id || !this._attachmentsService.permissions['3']) { return; }
        const queryString = !!unique_path ? `unique_path=${unique_path}` : `ids=${ids.toString()}`;
        const cancelItem = (options) => {
            if (!!options) {
                options['item'] && options['item'].remove();
                options['nodeData'] && this.gridApi.updateRowData({ remove: [options['nodeData']] });
                this._uploader.refreshQueue();
            }
        }
        this._apiService
            .delete(`${AttachmentUrls.ATTACHMENTS_MAIN_URL.replace('{sf_id}', sf_id)}?${queryString}`)
            .subscribe({
                next: (res) => {
                    cancelItem(cancelOptions);
                    if (!!skipNotify) {
                        return;
                    }
                    if (!!ids.length) {
                        this._metadataActions.fetchMetadata({ document_id: sf_id });
                    }
                    !!res['message'] && this._notificationService.success('success', res.message);
                }, error: (err: any) => {
                    cancelItem(cancelOptions);
                    this._notificationService.error('error', this._translate.instant('Something went wrong'));
                    this._attachmentsActions.fetchAttachmentsListData({ sf_id: sf_id });
                    throw err;
                }
            });
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function set payload data
     * @param params
     */
    private _setPayloadData() {
        this._attachmentsService.nameAfterEdit = null;
        this._attachmentsService.attachmentsInValid = false;
        this.attachmentsTreeGrid.fileNames = [];
        this.attachmentsTreeGrid.attachments = [];
        this.gridApi.forEachNode((node) => {
            this._attachmentsService.attachmentsInValid = !!this._attachmentsService.attachmentsInValid || !!node.data['name'].match(/[#%&{}\\><*?\/$!':"@]/);
            if (!!node.data['dummy_id'] || !!node.data['updated']) {
                this.attachmentsTreeGrid.attachments.push(node.data);
            }
        });
        this.attachmentsTreeGrid.attachments.sort((a, b) => a['dummy_id'] - b['dummy_id']);
        this._attachmentsService.attachmentsOnChange = !!this.attachmentsTreeGrid.attachments.length;
    }

    ngOnDestroy() {
        this.attachmentsTreeGrid = {};
        this._attachmentsService.permissions = { 1: true, 2: true, 3: true, 4: true };
        this._attachmentsService.attachmentsInValid = this._attachmentsService.attachmentsOnChange = this._attachmentsService.editCancel = this._attachmentsService.editClick = false;
        this._subscriptions.unsubscribe();
    }

}

function updateUniquePath(node?: any, name?: string): Array<object> {
    const pathIndex = node['level'];
    return getRowsToRemove(node).map((res) => {
        const data = res['unique_path'].split('/');
        data[pathIndex] = name;
        const extension = name.split(/\.(?=[^\.]+$)/)[1];
        res['extension'] = !!extension ? extension : '';
        res['unique_path'] = data.reduce((p, c) => p + '/' + c);
        res['name'] = data[data.length - 1];
        return res;
    });
}

function getFileCellRenderer() {
    function FileCellRenderer() { }
    let eGui;
    FileCellRenderer.prototype.init = (params) => {
        const tempDiv = document.createElement('div');
        const value = params.value;
        const paramData = params.data;
        const type_id = paramData ? paramData['type_id'] : 0;
        const iconClass = that._attachmentsTreeGridService.getFileIcon(params.value, type_id)
        const iconTemplate = `<img src="./assets/public/images/extension-icons/${iconClass}.svg"/>`;
        const progress = paramData ? paramData['progress'] : 0;
        const innerHtml = (!progress || progress === 100 || params.data.type_id === 1)
            ? `<span>${iconTemplate}<span class="filename" title="${value}">${value}</span></span>`
            : `<span><canvas class="file-progress" data-percent="${progress}"></canvas><span class="filename" title="${value}">${value}</span></span>`;
        tempDiv.innerHTML = innerHtml;
        eGui = (!progress || progress === 100 || params.data.type_id === 1) ? tempDiv.firstChild : pieChartProgress(tempDiv.firstChild);
    };
    FileCellRenderer.prototype.getGui = () => eGui;
    return FileCellRenderer;
}

function getInputCellEditor() {
    function InputCellEditor() { }
    InputCellEditor.prototype.init = function (params) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `<input class="ag-cell-edit-input" type="text" maxlength="${params['maxLength']}">`;
        this.eGui = tempDiv.firstChild;
        this.eGui.value = params.value;
        this.eGui.addEventListener('keydown', (event: KeyboardEvent) => {
            const isNavigationKey = event.keyCode === 37 || event.keyCode === 39
            if (isNavigationKey) {
                event.stopPropagation();
            }
        });
    };
    InputCellEditor.prototype.getGui = function () {
        return this.eGui;
    };
    InputCellEditor.prototype.afterGuiAttached = function () {
        this.eGui.focus();
        this.eGui.select();
    };
    InputCellEditor.prototype.getValue = function () {
        return this.eGui.value;
    };
    InputCellEditor.prototype.isPopup = function () {
        return false;
    };
    return InputCellEditor;
}

function getDateCellRenderer(params: object) {
    let cellValue = params['data'][params['column'].getColId().split('.')[0]];
    if (!!cellValue) {
        const date = !!cellValue['on'] ? `${new DateFormatPipe().transform(cellValue['on'])}` : '';
        const shortNameRef = that.attachmentsTreeGrid.reference['short_name'];
        const shortname = !!date && params['column'].getColId() === 'added' && !!cellValue['by'] && !!shortNameRef ? `${shortNameRef[cellValue['by']]}` : '';
        cellValue = `${date} ${shortname}`;
        return `<span title="${cellValue}">${cellValue}</span>`;
    }
    return '';
}

function getCategoryCellRenderer(params: object) {
    const categoriesList = that.attachmentsTreeGrid.categoryList[params['column'].getColId()];
    const values = (!!categoriesList && !!params['value'])
        ? params['value']
            .map((id) => {
                const category = categoriesList['list'].filter((data) => data['id'] === id)[0];
                return category ? category['name'] : '';
            })
        : '';
    const uniqueValues = Array.from(new Set(values));
    return `<span title="${uniqueValues.toString()}">${uniqueValues.toString()}</span>`;
}

function getExtensionCellRenderer(params: object) {
    let value = params['node']['data'] ? params['node']['data']['type_id'] === 1 ? 'FOLDER' : params['value'] : '';
    value = !!value ? that._translate.instant(value.toUpperCase()) : '';
    return `<span title="${value}">${value}</span>`;
}

export function getRowsToRemove(node) {
    let res = [];
    for (let i = 0; i < node.childrenAfterGroup.length; i++) {
        res = res.concat(getRowsToRemove(node.childrenAfterGroup[i]));
    }
    return node.data ? res.concat([node.data]) : res;
}

export function downloadAttachment(data?: any): Array<object> {
    if (!data.length) { return [] }
    let nodesToRemove = [];
    data.forEach(element => {
        nodesToRemove = nodesToRemove.concat(getRowsToRemove(element));
        nodesToRemove = nodesToRemove.filter(res => {
            return res['type_id'] !== 1;
        });
    });
    return nodesToRemove;
}

function getUniquePath(gridApi?: any): string {
    if (!gridApi) {
        return '';
    }
    const selectedNodes = gridApi.getSelectedNodes();
    if (selectedNodes.length > 0) {
        const data = selectedNodes[0].data;
        let path = '';
        if (data['type_id'] === 2 && !!selectedNodes[0]['parent']['data']) {
            path = `${selectedNodes[0]['parent']['data']['unique_path'].split(/\/$/)[0]}/`;
        }
        return data['type_id'] === 1 ? `${data.unique_path.split(/\/$/)[0]}/` : path;
    }
    return '';
}

function statAggFunction(values) {
    return Array.from(new Set(values)).length === 1 ? Array.from(new Set(values))[0] : 4;
}

function pieChartProgress(el) {
    const canvas = el.getElementsByTagName("canvas")[0];
    const percent = canvas.getAttribute('data-percent');
    const options: any = {
        percent: percent,
        size: 18,
        lineWidth: 9,
        rotate: 0
    }
    const ctx = canvas.getContext('2d');
    canvas['width'] = canvas['height'] = options.size;
    ctx.translate(options['size'] / 2, options.size / 2); // change center
    ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg
    const radius = (options.size - options.lineWidth) / 2;
    const drawCircle = function (color, lineWidth, percent) {
        percent = Math.min(Math.max(0, percent), 1);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth
        ctx.stroke();
    };
    drawCircle('#efefef', options.lineWidth, 100 / 100);
    drawCircle('#004E70', options.lineWidth, options.percent / 100);
    return el;
}
