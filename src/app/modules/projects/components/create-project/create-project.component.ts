
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ModuleEngineService } from '../../../../common/module_engine/services/module-engine.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import 'tinymce';
import { Subscription } from 'rxjs/Subscription';

import { ToggleService } from './../../../../core/services/toggle.service';
import { ApiService, SharedStorageService } from '../../../../core/services';
import { ProjectUrls, ContactUrls } from '../../../../core/constants/config';
import { NotificationService } from '../../../../common/notification/services/notification.service';
import { AttachmentsActions } from './../../../../common/attachments/store';
import { AttachmentsService } from './../../../../common/attachments/services';
import { Router } from '@angular/router';
import { ScaylaProjectRouting } from '../../constants/project.routing';
import { ProjectActions } from '../../store/project.actions';
import { CreateProjectVariable } from '../../models/';
import { ProjectService } from '../../services/project.service';
import { MODULES } from '../../../../common/shared/constants/config';
import { ScaylaProjectConstant } from '../../constants/project.constant';


@Component({
    selector: 'app-create-project',
    templateUrl: './create-project.component.html',
    styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit, OnDestroy {

    public projectForm: FormGroup;
    private _subscription = new Subscription();
    public createProjectVariable: CreateProjectVariable;
    private _nodeId: number;
    public isFlag: boolean;

    constructor(
        private _moduleEngineService: ModuleEngineService,
        private _sharedStorageService: SharedStorageService,
        private _projectActions: ProjectActions,
        private _projectService: ProjectService,
        private _router: Router,
        private _apiService: ApiService,
        private _translate: TranslateService,
        private _attachmentsActions: AttachmentsActions,
        public toggleService: ToggleService,
        public attachmentsService: AttachmentsService,
        public notificationService: NotificationService
    ) { }

    ngOnInit() {
        this._init();
    }

    private _init(): void {
        this._initCreateProjectVariable(this._getVariables());
        this.toggleService.initComposeToggle();
        this.loadProjectForm(10);
        this._isApiCallInProgress(this.createProjectVariable);
        this._getCurrentPorjectId(this.createProjectVariable);
        this._projectActions.updateCurrentPage({ currentPage: ScaylaProjectConstant.CREATE });


    }

    private _addValidation(group: FormGroup) {

        if (!group) {
            return;
        }
        group.get('name').setValidators(Validators.required);
        group.get('short_name').setValidators(Validators.maxLength(12));

    }

    /**
     * Function to return the variables(properties) used in the detail page
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     * 
    */
    private _getVariables(): CreateProjectVariable {
        const obj: CreateProjectVariable = {
            config: {},
            data: {},
            documentId: 0,
            projectId: 0,
            moduleId: JSON.parse(localStorage.getItem('module_key'))['project'],
            confirmMessageKey$: ScaylaProjectConstant.PROJECT_DETAIL_LEAVE,
            viewHistory: false,
            isPriority: false, editMode: false,
            isApiComplete: false
        };
        return obj;

    }

    /**
     * Function to init the project detail variable
     * @param obj
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _initCreateProjectVariable(obj: CreateProjectVariable): void {
        if (!obj) {
            return;
        }
        this.createProjectVariable = obj;
    }



    private _isApiCallInProgress(createProjectVariable: CreateProjectVariable): void {
        if (!createProjectVariable) {
            return;
        }
        this._subscription.add(this._sharedStorageService.getSpinnerState().subscribe((res) => {
            createProjectVariable.isApiComplete = !res.spinnerState;
        }));
    }

    /**
     * Function to load contact form tempalte
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    public loadProjectForm(templateId: number): void {
        if (templateId === undefined) {
            return;
        }
        this._moduleEngineService.getTemplateData(templateId).subscribe(res => {
            if (!!res && res['data']) {
                this.createProjectVariable.data = res.data;
                this.projectForm = this._moduleEngineService.returnForm(res);
                this._addValidation(this.projectForm);
                this.createProjectVariable.config = { template_id: res.data.id, layout: res.data.layout, data: this._moduleEngineService.makeFormData(res.data['template_fields']) };
            }
        });

    }

    /**
     * Function to save Project
     * @param $event:object
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    public submit($event: object): void {
        if (!$event) {
            return;
        }
        const data = this._moduleEngineService.converFormDataForSaving($event, this.createProjectVariable.data['template_fields']);
        this.createProjectVariable.data['template_fields'] = data;
        const body: object = {};
        if (this.createProjectVariable['projectId'] !== 0) {
            Object.assign(body, { parent_id: this.createProjectVariable['projectId'], flag: this.createProjectVariable.isPriority ? 1 : 0, project: JSON.stringify(this.createProjectVariable.data) });
        } else {
            Object.assign(body, { flag: this.createProjectVariable.isPriority ? 1 : 0, project: JSON.stringify(this.createProjectVariable.data) });
        }

        this._createProject(ProjectUrls.PROJECT_LIST, body);

    }


    /**
     * This function will create project
     * @param url -api url
     * @param body -payload to create project
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _createProject(url: string, body: object): void {
        if (!url || !body) {
            return;
        }
        this._subscription.add(this._apiService.post(url, body, false)
            .subscribe({
                next: (res) => {
                    this.createProjectVariable.currentResponse = res;
                    this._nodeId = res['data']['node_id'];
                    this.createProjectVariable.documentId = res['data']['sf_id'];
                }, error: (err: any) => {
                    (err.error) && this.notificationService.error('error', this._getErrorMessage(err.error, 'project'));
                    this.attachmentsService.allDisable=false;
                    throw err;
                }
            }));

    }

    /**
     * This function will call if project created successfully
     * 
     * @param res:API response
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _doIfProjectCreatedSuccessFully(res: object): void {
        if (!res) {
            return;
        }
        this.attachmentsService.allDisable = false;
        this.notificationService.success('success', res['message']);
        this.createProjectVariable.isPriority = false;
        this._projectActions.fetchTreeViewData({ moduleId: 1 });
        this._projectActions.updateCurrentProjectId({ currentProjectId: res['data']['id'] });
        this._projectActions.fetchProjectDetail({ project_id: res['data']['id'] });
        localStorage.setItem('detailView', 'true');
        const date = new Date();
        this._router.navigateByUrl(`${ScaylaProjectRouting.PROJECT}/${date.getUTCMilliseconds()}`);
    }

    /**
     * Function to get the current Project Id
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _getCurrentPorjectId(createProjectVariable: CreateProjectVariable): void {
        if (!createProjectVariable) {
            return;
        }
        this._subscription.add(this._projectService.getprojectId().subscribe((res) => {
            createProjectVariable['projectId'] = res;
        }));
    }

    /**
    * Function to handle page exit.
    *
    * @author Vijayan PP <vvijayan.pp@pitsolutions.com>
    */
    public pageExit(projectForm: FormGroup, pageCheckElement?: HTMLElement): void {
        if (!projectForm || !pageCheckElement) {
            return;
        }
        const date = new Date();
        if (!projectForm.pristine || this.attachmentsService.editClick || this.attachmentsService.attachmentsOnChange) {
            pageCheckElement.click();
        } else {
            this.closeButton(date.getMilliseconds())
        }
    }

    /**
     * This function will seprate error message
     *
     * @param error-error object
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>  
    */
    private _getErrorMessage(error: object, modules: string): any {
        if (!error || !modules) {
            return;
        }
        if (error && error['data']) {
            const message: Array<Array<string>> = (Object.entries(error['data'][modules])) ? Object.entries(error['data'][modules])[0][1] : error['message'];
            return message;


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
    public saveProject(form: FormGroup, isApiComplete: boolean): void {
        if (!form.valid) {
            return;
        }
        if (!!this.attachmentsService.attachmentsInValid) {
            this.notificationService.error('error', this._translate.instant('notification.attachmentsSpecialCharacter'));
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
    public setPriority(createProjectVariable: CreateProjectVariable): void {
        if (!createProjectVariable) {
            return;
        }
        createProjectVariable.isPriority = !createProjectVariable.isPriority;
        !!createProjectVariable.isPriority ? this.isFlag = true : null;
    }

    /**
    * Action trigger when close button clicked.
    * @param id=unique id
    *
    * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    public closeButton(id: number): void {
        if (id === undefined) {
            return;
        }
        this._projectActions.fetchProjectDetail({ project_id: this.createProjectVariable['projectId'] });
        this._router.navigateByUrl(`${ScaylaProjectRouting.PROJECT}/${id}`);
        this.toggleService.setGridActiveOrNot('tablebar', true);
        this.toggleService.setGridActiveOrNot('maincontent', true);
        localStorage.setItem('detailView', 'true');

    }

    /**
     * Function handle pop-up confirm
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    public handleConfirm(result: boolean): void {
        if (result) {
            const date = new Date();
            this.closeButton(date.getMilliseconds());
            return;
        }
    }

    /**
    * Function to execute actions after file upload
    *
    * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    */
    public attachmentUploaded(): void {
        this._doIfProjectCreatedSuccessFully(this.createProjectVariable.currentResponse);
    }

    /**
    * Function to save metadata
    *
    * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    */
    public getMetadata($event: any): void {
        $event['status'] = 1;
        $event['folder'] = this._nodeId;
        this._subscription.add(this._apiService.put(`${ContactUrls.SAVE_METADATA.replace('{id}', this.createProjectVariable.documentId.toString())}`, $event)
            .subscribe({
                next: (res) => {
                    this._attachmentsActions.updateRowData({ action: 'save', sf_id: this.createProjectVariable.documentId.toString() });
                }, error: (err: any) => {
                    (err.error) && this.notificationService.error('error', this._getErrorMessage(err.error, 'project'));
                    throw err;
                }
            }));
    }


    ngOnDestroy() {
        this._subscription.unsubscribe();
        this.toggleService.mainContentClose();
        this.createProjectVariable = undefined;
        this._projectActions.updateCurrentPage({ currentPage: '' });
    }
}
