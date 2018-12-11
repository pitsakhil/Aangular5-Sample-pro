import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { Subscription } from 'rxjs/Subscription';
import { skip } from 'rxjs/operators';

import { ProjectService } from '../../../services/index';
import { ProjectActions } from '../../../store/index';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridSortingHeaderComponent } from '../../../../../common/shared/components';
import { ProjectListData } from '../../../models/project.list.model';

import { ToggleService } from '../../../../../core/services';
import { DateFormatPipe } from '../../../../../common/shared/pipes/date-format.pipe';
import { ScaylaProjectRouting } from '../../../constants/project.routing';
import { ScaylaProjectConstant } from '../../../constants/project.constant';

let that: any;

@Component({
    selector: 'app-project-document-list-grid',
    templateUrl: './project-document-list-grid.component.html',
    styleUrls: ['./project-document-list-grid.component.scss'],
    providers: [DateFormatPipe]
})
export class ProjectDocumentListGridComponent implements OnInit, OnDestroy {

    public gridOptions: GridOptions;
    private _subscriptions = new Subscription();
    private _refrenceData: object;
    public _projectId: number;
    public timezoneTimeDiff: any;

    constructor(
        public projectService: ProjectService,
        public toggleService: ToggleService,
        private _projectActions: ProjectActions,
        private _activatedRoute: ActivatedRoute,
        private _translate: TranslateService,
        private dateFormatPipe: DateFormatPipe,
        private _router: Router,

    ) {
        that = this;
    }


    ngOnInit() {
        this._init();

    }

    /**
     * Function to invoke all the functions
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    private _init(): void {

        this._gridInitialize();
        this._fetchListOnScroll();
        this._getCurrentPorjectId()
        this.timezoneTimeDiff = {
            'timeDiff': localStorage.getItem('timeDiff'),
            'dateformat': localStorage.getItem('dateformat'),
            'timeformat': localStorage.getItem('timeformat')
        };
        this._watchIdChange();
    }

    /**
     * Function to listen url change
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    private _watchIdChange() {
        this._subscriptions.add(
            this._activatedRoute.params.pipe(skip(1)).subscribe((res) => {
                this._setRowData(this.gridOptions);
            })
        );
    }


    /**
     * This function is called on documentListGridComponent loading.
     * This function will initialize  grid options and set rowdata
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    private _columnDefs(): Array<Object> {
        return [

            { headerName: '<i class="material-icons">attach_file</i>', field: '', width: 70, suppressSorting: true, suppressMenu: true, suppressFilter: true },
            {
                headerName: that._translate.instant('aggrid.Template Name'), field: 'template_id', cellClass: [ 'ag-str-cell'], suppressSorting: true,
                cellRendererParams: {
                    padding: 15,
                },
                cellRenderer: function (params) {
                    if (!!params.node.data) {
                        return that._refrenceData['template_id'][params.value];
                    } else {
                        return '';
                    }
                },
                suppressMenu: true, suppressFilter: true
            },
            {
                headerName: that._translate.instant('aggrid.Name'),
                field: 'sf_name',
                cellClass: [ 'ag-str-cell'],
                cellRendererParams: {
                    padding: 15,
                },
                suppressMenu: true, suppressFilter: true
            },
            {
                headerName: that._translate.instant('aggrid.Responsible'),
                field: 'responsible_by_name',
                cellClass: [ 'ag-str-cell'],
                cellRendererParams: {
                    padding: 15,
                },
                suppressMenu: true, suppressFilter: true
            },
            {
                headerName: that._translate.instant('aggrid.Priority'), field: 'metadata.priority', suppressSorting: true,
                cellClass: [ 'ag-str-cell'],
                cellRendererParams: {
                    padding: 15,
                },
                suppressMenu: true, suppressFilter: true
            },
            {
                headerName: that._translate.instant('aggrid.Status'), field: 'metadata.status', suppressSorting: true,
                cellClass: [ 'ag-str-cell'],
                cellRendererParams: {
                    padding: 15,
                },
                suppressMenu: true, suppressFilter: true
            },
            {
                headerName: that._translate.instant('aggrid.Document Number'),
                field: 'metadata.sf_number',
                cellClass: [ 'ag-str-cell'],
                cellRendererParams: {
                    padding: 15,
                },
                suppressMenu: true, suppressFilter: true
            },
            {
                headerName: that._translate.instant('aggrid.Created'), field: 'created.on',
                cellClass: [ 'ag-str-cell'],
                cellRenderer: function (params) {
                    if (!!params.node.data) {
                        const creartedByName = params.node.data['created_by_name'];
                        return `${that._timezoneFormatter(params.value)} ${!!creartedByName ? creartedByName : ''}`;
                    } else {
                        return '';
                    }
                },
                cellRendererParams: {
                    padding: 15,
                },
                suppressMenu: true, suppressFilter: true
            },
            {
                headerName: that._translate.instant('aggrid.Edited'), field: 'modified.on',
                cellClass: [ 'ag-str-cell'],
                cellRenderer: function (params) {
                    if (!!params.node.data) {

                        const modifiedByName = params.node.data['modified_by_name'];
                        return `${!!params.value ? that._timezoneFormatter(params.value) : ''} ${!!modifiedByName ? modifiedByName : ''}`;
                    } else {
                        return '';
                    }
                },
                cellRendererParams: {
                    padding: 15,
                },
                suppressMenu: true, suppressFilter: true
            },


        ];
    }


    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     *
     * Function to initialize the grid
    */
    private _gridInitialize(): void {
        this.gridOptions = <GridOptions>{
            enableColResize: true,
            enableServerSideSorting: true,
            rowBuffer: 0,
            rowSelection: 'single',
            rowDeselection: true,
            columnDefs: this._columnDefs(),
            // tell grid we want virtual row model type
            rowModelType: 'infinite',
            // how big each page in our page cache will be, default is 100
            paginationPageSize: 25,
            cacheBlockSize: 25,
            cacheOverflowSize: 1,
            maxConcurrentDatasourceRequests: 1,
            icons: {
                sortAscending: '<i class="material-icons icon-18 icon-sort-asc">keyboard_arrow_down</i>',
                sortDescending: '<i class="material-icons icon-18 icon-sort-desc">keyboard_arrow_up</i>',
            }
            ,
            overlayLoadingTemplate: `<span>${this._translate.instant('Loading')}...</span>`,
            defaultColDef: true,
            maxBlocksInCache: 20,
            animateRows: false,
            rowHeight: 25,
            suppressResize: true,
            onGridReady: this._gridReadyFunction,
            onRowDoubleClicked: this._rowDoubleClicked,
            onRowClicked: this._rowClicked,


            suppressContextMenu: true
        };
    }





    /**
    * Function works when grid is ready
    *
    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    *
    * @param params
    */
    private _gridReadyFunction(params: object): void {
        if (!params) {
            return;
        }
        that._updateTheAgGridWithDataFromStore(params);
    }

    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     *
     * Function to fetch document list on scroll
     */
    private _fetchListOnScroll(): void {

        this._subscriptions.add(this.projectService.getProjectDocumentData().pipe(skip(1)).subscribe({
            next: (res) => {
                if (!!res) {
                    const rowsThisPage = this._formatData(res['projectDocumentsData']);
                    const params = res['projectDocumentsData']['params'];
                    const total_results = res['projectDocumentsData']['total_results'];

                    if (total_results !== 0) { params.successCallback(rowsThisPage, total_results); } else {

                        const dataSource = { rowCount: null, getRows: (params) => { params.successCallback([], 0) } }
                        this.gridOptions.api.setDatasource(dataSource);
                    }
                    this._selectTheActiveMenu(this.gridOptions);
                }
            }, error: (err) => {
                throw err;
            }
        }));
    }

    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     * 
     * @param  gridOptions:Gridoptions
     *
     * Function to update the ag grid with the the data from the store
     *
    */
    private _updateTheAgGridWithDataFromStore(gridOptions: GridOptions): void {
        if (!gridOptions) {
            return null;
        }

        this._setRowData(gridOptions);
    }



    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     * @param gridOptions
     *
     * Function to update the aggrid with data
     */
    public _setRowData(gridOptions: GridOptions): void {
        if (!gridOptions) {
            return;
        }

        const dataSource = {
            rowCount: null,
            getRows: (params) => {
                let sortOptions = { sortBy: '', sortOrder: '' };
                if (params.sortModel.length === 1) {
                    const sort_model = params.sortModel[0];
                    sortOptions = { sortBy: sort_model['colId'], sortOrder: sort_model['sort'] === 'asc' ? 'ASC' : 'DESC' };
                } else {
                    sortOptions['sortOrder'] = 'DESC'
                }
                const project_id = this._projectId;
                let _page_size = params.startRow / 25;
                const splitByDot = sortOptions.sortBy.split('.');
                let sortBy = (splitByDot[splitByDot.length - 1].indexOf('on') === -1) ? splitByDot[splitByDot.length - 1] : splitByDot[0];
                sortBy = (sortBy == '') ? 'created' : sortBy;
                (project_id !== 0) && this._projectActions.fetchProjectDocumentsData({ project_id: project_id, params: params, start_page: ++_page_size, sort_by: sortBy, sort_order: sortOptions.sortOrder, count: 25 });
            }
        };

        gridOptions.api.setDatasource(dataSource);
    }


    /**
     * Function to get the current Project Id
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _getCurrentPorjectId(): void {
        this._subscriptions.add(this.projectService.getprojectId().subscribe((res) => {
            this._projectId = res;
        }));
    }


    /**
     * This function will format the data to populate the aggrid
     * @param data
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _formatData(data: Array<Object>): Array<Object> {
        if (!!data && !!data['list']) {
            this._refrenceData = data['reference'];
            const formatedData: Array<Object> = data['list'].map((item, index) => {
                item['metadata']['status'] = this._setStatus(item, data['reference']['status']);
                item['metadata']['priority'] = this._setPriority(item, data['reference']['priority']);
                return item;
            });
            return formatedData;
        } else {
            return;
        }

    }



    /**
     * Function to format the item
     * @param item 
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _timezoneFormatter(item): string {
        if (!!item) {
            return this.dateFormatPipe.transform(item);
        } else {
            return;
        }
    }



    /**
     * This function will set the document status
     *
     * @param item
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _setStatus(item: object, status: object): string {
        if (!!item) {
            switch (item['metadata']['status']) {
                case 3:
                    return status['3'];
                case 2:
                    return status['2'];
                case 1:
                    return status['1'];
                default:
                    return status['3'];
            }
        } else {
            return;
        }
    }

    /**
     * This function will set the document priority
     * @param item
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _setPriority(item: object, priority: object): string {
        if (!!item) {
            switch (item['metadata']['priority']) {
                case 2:
                    return this.ucFirst(priority['2']);
                case 1:
                    return this.ucFirst(priority['1']);
                default:
                    return this.ucFirst(priority['1']);
            }
        } else {
            return;
        }
    }


    /**
     * This function will set the document template name
     * @param item
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _setTemplateName(item: object, template: object): String {
        if (!!item) {

            switch (item['template_id']) {
                case 3:
                    return template['3'];
                case 2:
                    return template['2'];
                case 1:
                    return template['1'];
                default:
                    return template['1'];
            }

        } else {
            return;
        }
    }

    /**
     * This function change the first letter of a string to upper case
     * @param string 
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */

    public ucFirst(string: string): string {
        if (!string) {
            return;
        }
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
    * Function to navigate to the create project page
    * 
    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
   */

    public navigateToProject() {
        this._createProject(ScaylaProjectRouting.CREATE_PROJECT);
    }


    /**
     * Function to navigate to the create project page
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _createProject(page: string): void {
        if (!page) {
            return;
        }
        this._router.navigate([`${page}`]);
    }

    /**
    * Function trigger when a node is clicked.
    * @param params : Data of the selected node.
    *
    * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    private _rowDoubleClicked(params): void {
        if (!params) {
            return;
        }
        if (params.data['sf_type'] === 'projects') {
            that.projectService.showHistory({ project: true, history: false, handover: false });
            that._triggerDetailView(that._projectId);
            params.node.setSelected(true);

        } else {

            params.node.setSelected(false);
            return;
        }
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     * 
     * Function trigger detail view.
     */
    public triggerPanelOpen(): void {
        const selectedNode = this.gridOptions.api.getSelectedNodes()[0];
        if (selectedNode.data['sf_type'] === 'projects') {
            this.projectService.showHistory({ project: true, history: false, handover: false });
            this._triggerDetailView(this._projectId);
        }
        return;
    }

    /**
    * Function trigger when a node is clicked.
    * @param params : Data of the selected node.
    *
    * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    private _rowClicked(params): void {
        if (!params) {
            return;
        }
        if (!params.data['sf_type']) {
            params.node.setSelected(false);
            return;
        }
    }



    /**
     * This page wil open the detail view of the current project
     * @param page-current page 
     * 
     * @author Vijayan PP
    */
    private _triggerDetailView(project_id: number): void {
        if (project_id === undefined) {
            return;
        }
        const date = new Date();
        this._projectActions.fetchProjectDetail({ project_id: project_id });
        this.toggleService.setGridStatus('rightbar', true, 5);
        this.toggleService.setGridActiveOrNot('maincontent', true);

    }

    /**
    * Function to preselect ag grid node.
    * @param event : ag grid event.
    *
    * @author Vijayan PP <vijayan.pp@pitsolutions.com>
   */
    private _selectTheActiveMenu(params: object): void {
        if (!params) {
            return null;
        }
        that._selectNode(params, "projects");
    }

    private _selectNode(params: GridOptions, project: string): void {
        if (!params) {
            return;
        }



        params['api'].forEachNode(function (node) {
        
            if (node.data&&node.data['sf_type'] === project) {
                node.setSelected(true);
            }
        })

    }


    private _selectTheNode(params: GridOptions, index: number) {
        if (!params) {
            return;
        }
        const node = params['api'].getDisplayedRowAtIndex(index);
        !!node && node.setSelected(true);
    }




    /**
     * unsubscrbe all the subscriptions
    */
    ngOnDestroy() {
        this._subscriptions.unsubscribe();

    }




}
