import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, Validators } from '@angular/forms';
import { skip } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import 'tinymce';
import { ModuleEngineService } from '../../../../common/module_engine/services/module-engine.service';
import { ProjectService } from '../../services/project.service';
import { ToggleService, ApiService, SharedStorageService } from '../../../../core/services';
import { NotificationService } from '../../../../common/notification/services/notification.service';
import { AttachmentsService } from './../../../../common/attachments/services';
import { AttachmentsActions } from './../../../../common/attachments/store';
import { ProjectUrls, ContactUrls } from '../../../../core/constants/config';
import { ProjectActions } from '../../store/project.actions';
import { ProjectDetailVariable } from '../../models/';
import { ScaylaProjectRouting } from '../../constants/project.routing';
import { ScaylaProjectConstant } from '../../constants/project.constant';
import { MODULES } from './../../../../common/shared/constants/config';
import { DomSanitizer } from '@angular/platform-browser';
import { MetadataService } from './../../../../common/shared/services/metadata.service';
import 'rxjs/add/operator/skip';
import { MetadataActions } from '../../../../common/shared/store/metadata.actions';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

    private _subscription = new Subscription();
    public projectDetailVariable: ProjectDetailVariable;
    public description$: string;
    public projectForm: FormGroup;
    public viewHistory: boolean;
    public disableHistory: boolean;
    public viewHandover: boolean;
    public viewProject: boolean;


    constructor(
        public toggleService: ToggleService,
        public attachmentsService: AttachmentsService,
        private _moduleEngineService: ModuleEngineService,
        private _projectActions: ProjectActions,
        private _metadataService: MetadataService,
        public _projectService: ProjectService,
        private _apiService: ApiService,
        private _notificationService: NotificationService,
        private _sharedStorageService: SharedStorageService,
        private _domSanitizer: DomSanitizer,
        private _router: Router,
        private _translate: TranslateService,
        private _attachmentsActions: AttachmentsActions,
        private metadataActions: MetadataActions

    ) {

    }

    ngOnInit() {
        this._init();

    }

    public _init(): void {
        this._initProjectDetailVariable(this._getVariables());
        this.toggleTab('project');
        this._fetchprojectDetailData();
        this._isApiCallInProgress(this.projectDetailVariable);
        this._getCurrentPorjectId(this.projectDetailVariable);
        this._projectActions.updateCurrentPage({ currentPage: ScaylaProjectConstant.DETAIL });
        this._projectService.currentValue.subscribe(payload => {
            this.viewProject = payload['project'];
            this.viewHistory = payload['history'];
            this.viewHandover = payload['handover'];
        });
        this._addMetadataSubscription();
    }



    /**
     * Function to return the variables(properties) used in the detail page
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     * 
    */
    private _getVariables(): ProjectDetailVariable {
        const obj: ProjectDetailVariable = {
            config: {},
            data: {},
            documentId: 0,
            moduleId: MODULES.PROJECTS,
            projectId: 0,
            confirmMessageKey$: ScaylaProjectConstant.PROJECT_DETAIL_LEAVE,
            confirmDeleteMessageKey$: ScaylaProjectConstant.PROJECT_DELETE_CONFIRM,
            viewHistory: false,
            isPriority: false, editMode: false,
            isApiComplete: false,
            responseMessage: '',
            patchValue: {},
            isHandover: false,
            projectData: {}
        };
        return obj;

    }

    /**
     * Function to init the project detail variable
     * @param obj
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _initProjectDetailVariable(obj: ProjectDetailVariable): void {
        if (!obj) {
            return;
        }
        this.attachmentsService.addDisable = true;
        this.projectDetailVariable = obj;
    }


    /**
        * Function to trigger delete event on delete button click
        *
        * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
        */
    public _addMetadataSubscription() {
        this._subscription.add(this._metadataService.permission.subscribe((res) => {
            this.projectDetailVariable.isHandover = res;
        }))
    }

    /**
     * Get the Api call progress status
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _isApiCallInProgress(projectDetailVariable: ProjectDetailVariable): void {
        if (!projectDetailVariable) {
            return;
        }
        this._subscription.add(this._sharedStorageService.getSpinnerState().subscribe((res) => {
            this.projectDetailVariable.isApiComplete = !res.spinnerState;

        }));
    }

    /**
    * Function fetch project details from store
    *
    *@author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    private _fetchprojectDetailData(): void {
        this._subscription.add(this._projectService.getprojectDetails().pipe(skip(1)).subscribe({
            next: (res) => {
                this.projectDetailVariable.documentId = +res['currentProjectDetail']['sf_id'];
                this.description$ = res['currentProjectDetail']['description'];               
                this._loadProjectForm(10, res);

            }, error: (err) => {

            }

        }));
    }

    /**
      * Function to load contact form
      *
      * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    private _loadProjectForm(templateId: number, data: object): void {
        if (!data || templateId === undefined) {
            return;
        }
        this._moduleEngineService.getTemplateData(templateId).subscribe(res => {
            if (!!res && res['data']) {
                this.projectDetailVariable.data = res.data;
                this.projectForm = this._moduleEngineService.returnForm(res);
                this.projectDetailVariable.config = { template_id: res.data.id, layout: res.data.layout, data: this._moduleEngineService.makeFormData(res.data['template_fields']) };
                this.projectDetailVariable.isPriority = data['currentProjectDetail']['flag'];
                this.projectDetailVariable.patchValue = this._domSanitizer.bypassSecurityTrustHtml(data['currentProjectDetail']['description']);
                this.projectForm.patchValue(data['currentProjectDetail']);
                this.projectDetailVariable.projectData = data['currentProjectDetail'];
                this._addValidation(this.projectForm);
                this._writeValueToEditor(data['currentProjectDetail']['description'], tinymce.activeEditor);
                this.projectDetailVariable.editMode = false;
                this.attachmentsService.addDisable = true;
            } else {
                return;
            }
        });
    }

    private _addValidation(group: FormGroup) {

        if (!group) {
            return;
        }
        group.get('name').setValidators(Validators.required);
        group.get('short_name').setValidators(Validators.maxLength(12));

    }


    /**
     * Function to write the value to editor
     * @param value
     * @param editor
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _writeValueToEditor(value: any, editor: any): void {
        if (value == undefined) {
            this.projectDetailVariable.patchValue = '';
        }
        if (!!editor) {
            editor.setContent(value, { format: 'raw' });

        } else {
            return;
        }
    }

    /**
     * Function to update the project with the dat from the form
     * @param
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public submit(formData: object): void {
        if (!formData) {
            return;
        }
        if (this.viewHistory || this.viewHandover) {
            this.viewHistory = false;
            this.viewHandover = false;
            this.viewProject = true;
        }
        this.projectDetailVariable.patchValue = formData['description'];
        const data = this._moduleEngineService.converFormDataForSaving(formData, this.projectDetailVariable.data['template_fields']);
        this.projectDetailVariable.data['template_fields'] = data;
        const project_id = this.projectDetailVariable.projectId;
        const body = Object.assign({}, { id: project_id, flag: this.projectDetailVariable.isPriority ? 1 : 0, project: JSON.stringify(this.projectDetailVariable.data) });
        this._updateProject(ProjectUrls.PROJECT_LIST, +project_id, body);
    }


    /**
     * Function to get the current Project Id
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _getCurrentPorjectId(projectDetailVariable: ProjectDetailVariable): void {
        if (!projectDetailVariable) {
            return;
        }
        this._subscription.add(this._projectService.getprojectId().subscribe((res) => {
            projectDetailVariable['projectId'] = +res;
            if (+res === 0) {
                this.projectDetailVariable.editMode = false;
                this.attachmentsService.addDisable = true;
                projectDetailVariable.documentId = 0;
                this.viewHistory = false;
            }
        }));
    }

    /**
     * This function will update the project
     * @param url
     * @param project_id
     * @param body
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _updateProject(url: string, project_id: number, body: object): void {
        if (!url || project_id === undefined || !body) {
            return;
        }
        this._subscription.add(this._apiService.put(`${url}/${project_id}`, body, false)
            .subscribe({
                next: (res) => {
                    this.projectDetailVariable.currenResponse = res;
                    this._attachmentsActions.updateRowData({ action: 'edit', sf_id: this.projectDetailVariable.documentId.toString() });
                    this.metadataActions.fetchMetadata({ document_id: this.projectDetailVariable.documentId.toString() });
                }, error: (err: any) => {
                    // tslint:disable-next-line:no-unused-expression
                    (err.error) && this._notificationService.error('error', this._getErrorMessage(err.error, 'project'));
                    this.attachmentsService.allDisable = false;
                    throw err;
                }
            }));
    }

    /**
     * Function to execute actions after file upload
     *
     * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     */
    public attachmentUploaded(event): void {
        this._doAfterProjectUpdatedSuccessfully(this.projectDetailVariable.currenResponse);
    }

    /**
     * This function will call after the project updated successfully
     * @param res:Ari res
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _doAfterProjectUpdatedSuccessfully(res: object, html?: HTMLAllCollection): void {
        if (!res) {
            return;
        }
        this.attachmentsService.allDisable = false;
        this._notificationService.success('success', res['message']);
        this._projectActions.fetchTreeViewData({ moduleId: 1 });
        this._projectActions.updateCurrentProjectId({ currentProjectId: res['data']['id'] });
        const date = new Date();
        this._router.navigateByUrl(`${ScaylaProjectRouting.PROJECT}/${date.getUTCMilliseconds()}`);
        this.projectDetailVariable.responseMessage = res['message'];
        this.projectDetailVariable.editMode = false;
        this.attachmentsService.addDisable = true;
    }

    /**
    * This function will seprate error message
    *
    * @param error-error object
    *
    * @author Vijayan PP<vijayan.pp@pitsolutions.com>  
   */
    private _getErrorMessage(error: object, modules?: string): string {
        if (!error) {
            return;
        }
        if (error && error['data']) {
            const message: Array<Array<string>> = (modules) ? Object.entries(error['data'][modules]) : error['data']['status']
            return message[0][1];

        } else {
            return error['message'];
        }

    }




    /**
     * Function to get id of button clicked.
     * @param event : element event.
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    public saveproject(isApiComplete: boolean, form: FormGroup): void {
        if (!form.valid && isApiComplete === undefined) {
            return;
        }
        if (!!this.attachmentsService.attachmentsInValid) {
            this._notificationService.error('error', this._translate.instant('notification.attachmentsSpecialCharacter'));
            return;
        }
        this.attachmentsService.allDisable = true;
        this.submit(form.value);

    }


    /**
     * Function to set priority
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    public setPriority(isApiComplete: boolean, editMode: boolean): void {
        if (!editMode) {
            return;
        }
        if (isApiComplete) {
            this.projectDetailVariable.isPriority = !this.projectDetailVariable.isPriority;
            !!this.projectDetailVariable.isPriority ? this._metadataService.toggleFlag(true) : null
        } else {
            return;
        }
    }

    /**
       * Function to handle delete submit
       * @param event
       *
       * @author Vijayan PP <vijayan.pp@pitsolutions.com>
      */
    public handleCloseConfirm(result: boolean): void {
        if (!result) {
            this.toggleService.setGridActiveOrNot('maincontent', false);
            localStorage.removeItem('detailView')
        } else {
            this.projectDetailVariable.editMode = false;
            this.attachmentsService.addDisable = true;
            return;
        }
    }


    /**
       * Function to handle delete submit
       * @param event
       *
       * @author Vijayan PP <vijayan.pp@pitsolutions.com>
      */
    public handleCloseConfirmPopUp(result: boolean): void {
        if (result) {
            this.toggleService.setGridActiveOrNot('maincontent', false);
            localStorage.removeItem('detailView')
        } else {
            return;
        }
    }


    /**
     * Function to handle delete submit
     * @param event
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    public handleDeleteConfirm(result: boolean, isApiComplete: boolean): void {
        if (!!result) {
            const project_id = this.projectDetailVariable.projectId;
            if (isApiComplete) {
                this._projectActions.deleteCurrentProject({ project_id: project_id });

            }
        } else {
            return;
        }
    }

    /**
     * 
     * @param form 
     * @param pageElement 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public exitPage(form: FormGroup, pageElement: HTMLElement): void {        
        if (this.attachmentsService.editClick || this.attachmentsService.attachmentsOnChange) {
            pageElement.click();
        } else if (form && pageElement) {          
            (form.pristine&&this.description$===form.value['description']) ? this.handleCloseConfirm(this.projectDetailVariable.editMode) : pageElement.click();
        } else {
            this.handleCloseConfirm(this.projectDetailVariable.editMode)
            return;
        }

    }

    /**
     * Function to toggle the edit mode
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public toggleEditMode(projectDetailVariable: ProjectDetailVariable) {
        if (!projectDetailVariable) {
            return;
        }
        projectDetailVariable.editMode = !projectDetailVariable.editMode;
        this.attachmentsService.setGridEditable(!projectDetailVariable.editMode);
        if (this.viewHistory || this.viewHandover) {
            this.viewHistory = false;
            this.viewHandover = false;
            this.viewProject = true;
        }
    }

    /**
    * Function to navigate to the create project page
    * 
    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
   */

    public navigateToProject() {
        this._createProject(ScaylaProjectRouting.CREATE_PROJECT);
    }

    public showInfoBox(projectDetailVariable: ProjectDetailVariable): boolean {
        if (!projectDetailVariable) {
            return;
        }
        return (projectDetailVariable.projectId !== 0 && projectDetailVariable.projectId) ? true : false;
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



    public toggleTab(tab: string): void {
        if (tab === 'project') {
            this._fetchprojectDetailData();
            this.viewProject = true; this.viewHistory = false;
        } else if (tab === 'history') {
            this.viewProject = false; this.viewHistory = true;
        }
    }


    /**
     * Function to unsuscribe subscriptions and empty listprojectData at page destruction time.
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    ngOnDestroy() {
        this.attachmentsService.addDisable = false;
        this.toggleService.mainContentClose();
        this._subscription.unsubscribe();
        this.projectDetailVariable = undefined;
        this._projectActions.updateCurrentPage({ currentPage: '' });

    }

}
