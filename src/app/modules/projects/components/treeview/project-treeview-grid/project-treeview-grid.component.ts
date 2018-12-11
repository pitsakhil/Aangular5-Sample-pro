import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GridOptions } from 'ag-grid';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { skip } from 'rxjs/operators';

import { ScaylaProjectRouting } from '../../../constants/project.routing';
import { ProjectActions } from '../../../store/index';
import { ToggleService } from '../../../../../core/services/';
import { ProjectService } from '../../../services';
import { ScaylaProjectConstant } from '../../../constants/project.constant';


let that: any;


@Component({
    selector: 'app-project-treeview-grid',
    templateUrl: './project-treeview-grid.component.html',
    styleUrls: ['./project-treeview-grid.component.scss']
})
export class ProjectTreeviewGridComponent implements OnInit, OnDestroy {
    @Output() public openEditMode = new EventEmitter<boolean>();

    public gridOptions: GridOptions;
    private _data: Array<Object> = [{}];
    private _currentPage: string;
    private _projectId: number;
    private _subscription = new Subscription();
    public historyValue: boolean;
    constructor(
        private _projectService: ProjectService,
        private _projectActions: ProjectActions,
        private _router: Router,
        private _translate: TranslateService,
        public toggleService: ToggleService,
        private _activatedRoute: ActivatedRoute,

    ) { }

    ngOnInit() {
        this._init();
    }


    /**
     * This function will invoke all the functions
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    private _init(): void {
        that = this;
        this._gridInitialize();
        this._getCurrentPage();
        this._getCurrentPorjectId();
        this._projectService.currentValue.subscribe(payload => this.historyValue = payload);
    }

    /**
     * This function is called on documentNavbarGridComponent loading.
     * This function will initialize  grid options.
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _gridInitialize(): void {

        this.gridOptions = <GridOptions>{
            columnDefs: this._columnDefs(),
            rowSelection: 'single',
            rowDeselection: true,
            autoGroupColumnDef: {
                headerName: 'Organisation Hierarchy',
                tooltip: this._getTooltip,
                cellRendererParams: {
                    suppressCount: true,
                    padding: 45
                }
            },
            enableColResize: true,
            icons: {
                groupExpanded: '<i class="material-icons" >keyboard_arrow_down</i>',
                groupContracted: '<i class="material-icons">keyboard_arrow_right</i>',
            },
            treeData: true,
            groupDefaultExpanded: -1,
            getDataPath: this._getDataPath,
            animateRows: true,
            rowHeight: 25,
            getRowNodeId: (data) => data.project_id,
            onRowClicked: this._navRowClicked,
            onGridReady: this.gridReadyFunction,
            cellContextMenu: false,
            suppressContextMenu: true,
            overlayLoadingTemplate: `<span>${this._translate.instant('Loading')}...</span>`,
        };
    }

    /**
     * Function returns the column ddefinition
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    private _columnDefs(): Array<Object> {
        return [{}];
    }

    /**
     * Function to get the date path
     * @param data
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _getDataPath(data) {
        if (!data) {
            return;
        }
        return data.unique_path.split('/');
    }

    /**
     * Function to ge the tooltip string
     * @param node
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _getTooltip(node: object): string {
        if (!node) {
            return;
        }

        return node['data'] && node['data']['node_name'] ? node['data']['node_name'] : ''
    }

    /**
     * Function to set row data when aggrid is ready
     * @param event : ag grid event.
     *
     * @author Vijayan PP K <vijayan.pp@pitsolutions.com>
     */
    public gridReadyFunction(params: object): void {
        that._setRowData(params);
    }

    /**.
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     *
     * Function to draw the navigation menu
    */
    private _setRowData(params: Object): void {
        if (!params) {
            return null;
        }
        const date = new Date();
        this._subscription.add(this._projectService.getProjectTreeViewData().pipe(skip(1)).subscribe({
            next: (res) => {
                if (res !== null && res['treeViewData']) {
                    const rowData = res['treeViewData']['list'];
                    (rowData[1]) && localStorage.setItem('project_id', rowData[1]['project_id']);
                    (this.gridOptions.api) && this.gridOptions.api.setRowData(rowData);
                    this._selectTheActiveMenu(this.gridOptions);
                }
            },
            error: (err) => {
                throw err;
            }
        }));

        // To handle the page refresh
        (window.location.pathname === '/') && this._router.navigate([`${ScaylaProjectRouting.PROJECT}/${date.getMilliseconds()}`]);

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
        that._selectNode(params, that._projectId);
    }

    private _selectNode(params: GridOptions, projectId: number): void {
        if (!params) {
            return;
        }

        if (projectId !== 0) {
            params['api'].forEachNode(function (node) {
                if (+node.id === projectId) {
                    node.setSelected(true);
                }
            })
            if (params['api'].getSelectedNodes().length === 0) {
                that._selectTheNode(params, 1);
            }
        } else {
            that._selectTheNode(params, 0);
        }
    }

    private _selectTheNode(params: GridOptions, index: number) {
        if (!params) {
            return;
        }
        const node = params['api'].getDisplayedRowAtIndex(index);
        !!node && node.setSelected(true);
    }
    /**
     * This function will set the current page
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _getCurrentPage() {
        this._subscription.add(this._projectService.getCurrentPage().subscribe((res) => {
            this._currentPage = res;
        }));
    }

    /**
     * Function to get the current Project Id
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _getCurrentPorjectId(): void {
        this._subscription.add(this._projectService.getprojectId().subscribe((res) => {

            this._projectId = +res;
        }));
    }


    /**
    * Function trigger when a node is clicked.
    * @param nodeData : Data of the selected node.
    *
    * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    private _navRowClicked(params): void {
        if (!params) {
            return;
        }
        if (params['node']['level'] === 0) {
            that._selectParentNodeOrNot(that._currentPage, params);
            that._triggerDetailView(that._currentPage, -1);
            that._projectService.enableAdd = true;
            that._projectService.enableDelete = true;
            return;
        }
        that._projectService.showHistory({ project: true, history: false, handover: false });
        const project_id = params.node.data.project_id;
        localStorage.setItem('parentId', params.node.data.parent_id);
        that._projectActions.updateCurrentProjectId({ currentProjectId: project_id });
        that._triggerDetailView(that._currentPage, project_id);
        that._projectService.enableAdd = params.node.data.project_permissions['4'];
        that._projectService.enableDelete = params.node.data.project_permissions['3'];



    }


    /**
    * Function trigger when a node is dobule clicked.
    * @param nodeData : Data of the selected node.
    *
    * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    private _navRowDoubleClicked(params): void {
        if (!params) {
            return;
        }

        if (params['node']['level'] === 0) {
            that._selectParentNodeOrNot(that._currentPage, params);
            return;
        }

        if (that._currentPage === ScaylaProjectConstant.CREATE) {
            const project_id = params.node.data.project_id;
            that._projectActions.updateCurrentProjectId({ currentProjectId: project_id });
            that._triggerDetailViewFromCreate(that._currentPage, project_id);
        } else {
            return;
        }

    }




    private _selectParentNodeOrNot(page: string, params) {
        params.node.setSelected(true);
        that._projectActions.updateCurrentProjectId({ currentProjectId: 0 });
        that._projectActions.updateProjectDetail({ currentProjectDetail: {} });

        return

    }


    /**
     * This page wil open the detail view of the current project
     * @param page-current page 
     * 
     * @author Vijayan PP
    */
    private _triggerDetailView(page: string, project_id: number) {

        const date = new Date();
        that._projectActions.fetchProjectDetail({ project_id: project_id });
        that.toggleService.setGridStatus('rightbar', true, 5);
        that.toggleService.setGridActiveOrNot('maincontent', true);
        that._router.navigate([`${ScaylaProjectRouting.PROJECT}/${date.getUTCMilliseconds()}`]);
        (project_id !== -1) && localStorage.setItem('detailView', 'true');

    }

    /**
     * This page wil open the detail view of the current project
     * @param page-current page 
     * 
     * @author Vijayan PP
    */
    private _triggerDetailViewFromCreate(page: string, project_id: number) {
        if (page === ScaylaProjectConstant.CREATE) {
            const date = new Date();
            that._projectActions.fetchProjectDetail({ project_id: project_id });
            localStorage.setItem('detailView', 'true');
            that._router.navigateByUrl(`${ScaylaProjectRouting.PROJECT}/${date.getUTCMilliseconds()}`);


            this.openEditMode.emit(false);
        } else {
            return;
        }
    }



    ngOnDestroy() {

        this._subscription.unsubscribe();

    }




}
