import { Component, OnInit, Input, OnDestroy, OnChanges, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MetadataVariables, Body } from '../../models/metadataList.model';

import { ApiService } from '../../../../core/services/api.service';
import { MetadataService } from '../../services/metadata.service';
import { MetadataActions } from '../../store/metadata.actions';
import { ModuleEngineService } from './../../../../common/module_engine/services/module-engine.service';
import { HistoryService } from '../../services/history.service';

import { HistoryActions } from '../../store';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { MetadataUrls } from '../../constants/config';
import { DropdownSettings } from '../../../scayla-select/ca-select.interface';
import { IMyDpOptions, IMyDateModel } from '../../../ngx-datepicker';
import * as moment from 'moment';
import { skip } from 'rxjs/operators';
import { NotificationService } from '../../../notification/services/notification.service';
@Component({
    selector: 'app-metadata',
    templateUrl: './metadata.component.html',
    styleUrls: ['./metadata.component.scss'],
    providers: [DateFormatPipe]
})
export class MetadataComponent implements OnInit, OnDestroy, OnChanges {
    @Input() documentId: number;
    @Input() moduleId: number;
    @Input() updateDocumentId: {};
    @Input() isFlag: boolean;

    private _defaultUserId = JSON.parse(localStorage.getItem('DEFAULT_CONTACT_ID'));
    private date = new Date();
    public minutesList = [{ id: '00', itemName: '00' }, { id: '30', itemName: '30' }];
    private _timezone = localStorage.getItem('timezone');
    public confMessage$ = 'confirmation';
    private _isprivate = false;

    myOptions: IMyDpOptions = {
        allowDeselectDate: true,
        editableDateField: false,
        dateFormat: localStorage.getItem('dateformat'),
        disableUntil: { day: new Date(Date.now() - 864e5).getDate(), month: this.date.getDate() === 1 ? this.date.getMonth() : this.date.getMonth() === 1 ? 1 : this.date.getMonth() + 1, year: this.date.getFullYear() }
    };

    public saveMetadata: EventEmitter<null> = new EventEmitter();
    public body: Body = {};
    public payload: any;
    public metadataVariables: MetadataVariables = {};
    public metadataForm: FormGroup;
    private _subscriptions = new Subscription();
    public isEditPermission: boolean;
    public projectCloneSettings: DropdownSettings;
    public metadata_settings: DropdownSettings;
    public isModalEnabled: string;
    public errorMessage$: string;
    public timeDifference: string;
    private updateFlag: boolean;
    private _folderDetails;

    constructor(
        private _apiService: ApiService,
        private _fb: FormBuilder,
        private _historyActions: HistoryActions,
        private _historyService: HistoryService,
        private metadataActions: MetadataActions,
        private metadataService: MetadataService,
        private _moduleEngineService: ModuleEngineService,
        private dateFormatPipe: DateFormatPipe,
        private _notificationService: NotificationService
    ) {
        this.isEditPermission = false;
    }

    @ViewChild('status', { read: ElementRef }) tref: ElementRef;
    @ViewChild('priority') pr: ElementRef;

    /**
     * Function to detect contact id change and trigger functions for updating datas
     *
     *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     *
     * @param changes
     */
    ngOnChanges(changes: object): void {
        this._onInputChange(changes);
        this.updateFlag = true;
    }

    /**
    * Function invokes on input value change
    *
    *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    *
    * @param changes
    */

    private _onInputChange(changes: object): void {
        if (changes && changes['documentId']) {
            this._prefillValue();
            this.documentId = changes['documentId']['currentValue'];
        }
        if (changes && changes['documentId'] && !!this.documentId && !!this.moduleId) {
            this._prefillValue();
            this.metadataActions.fetchMetadata({ document_id: this.documentId });
        }
        this._isprivate = false;
        if (this.updateDocumentId) {
            this.documentId = this.updateDocumentId['id'];
            !!this.updateDocumentId['isSave'] ? this._updateSelectedValue(1, 'status') : this._updateSelectedValue(3, 'status')
        }
        if (!!this.isFlag) {
            this._prefillValue();
            this._updateFlag();
            this.isFlag = false;
            this.updateFlag = false;
        }
    }

    /**
     * Invokes all the functions those should call initially.
     *
     *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     *
     */
    ngOnInit() {
        this._prefillValue();
        this._initVariables();
        this._initScaylaSelect();
        this._getMetadataDetils();
        this._addSubscriptions();
        this.timeDifference = localStorage.getItem('timeDiff');
    }

    /**
 * add subscriptions initially
 *
 *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 */
    private _addSubscriptions(): void {
        this._historyService.currentPayload.subscribe(payload => this.payload = payload);
        this._subscriptions.add(this.metadataService.flag.subscribe((res) => {
            !!this.updateFlag ? this.metadataVariables.metadata['priority'] !== 2 ? (this._updateFlag(), this.updateFlag = false) : null : null
        }));
        // reset metadata on response 403
        this._subscriptions.add(this.metadataService.accesDenied.subscribe((res) => {
            this._isprivate = true;
            this._prefillValue();
            this._updatePermission(false);
            this.isEditPermission = false;
        }));
    }

    /**
 * updates permission to high if its normal on flagging
 *
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 */
    private _updateFlag() {
        this._updateSelectedValue(2, 'priority');
        this.metadataVariables.metadata['priority'] = 2;
        this.metadataForm.patchValue({ priority: 2 });
    }

    /**
   * Function to initialize variables
   *
   * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   */
    private _initVariables(): void {
        this.metadataVariables = { statusData: [], priorityData: [], responsibleData: [], delegateData: [], permissionData: [], projectData: [], created$: '', edited$: '', documentNumber: '', notes: '' };
        this._fetchMetadataTemplate();
    }

    /**
     * Function to intialize metadata form
     *
     *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     *
     */
    private _prefillValue(): void {
        this.metadataForm = this._fb.group({
            status: [''],
            priority: [''],
            responsible: [''],
            delegate: [''],
            permission: [''],
            project: [''],
            deadline_date: [''],
            deadline_time: ['']
        });
        this.metadataVariables.created$ = '';
        this.metadataVariables.edited$ = '';
        this.metadataVariables.notes = '';
        this.metadataVariables.documentNumber = '';
    }

    /**
     * Function to set MEATADATA SCAYLA SELECT component settings
     *
     *@author David Raja <david.ra@pitsolutions.com>
     *
     */
    private _initScaylaSelect(): void {
        this.metadata_settings = {
            singleSelection: true,
            enableSearchFilter: false,
            clearEnabled: false,
        };
        this.projectCloneSettings = {
            selectType: 'clone',
            clearEnabled: false,
        };
    }

    /**
    * Handle confirmation of private permission change
    *
    *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    *
    */
    public handleConfirm(result): void {
        !!result ? (this.metadataForm.patchValue({ permission: 2 }), this._updateSelectedValue(2, 'sf_permission')) : (this.metadataForm.patchValue({ permission: 1 }));
    }

    /**
   * Function to get changes from status, priority and responsible fields for updating those in server
   *
   *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   */
    public selected(event: object, type: string): void {
        type === 'sf_permission' && event['id'] === 2 ? this._handlePermission(event, type) : this._updateSelectedValue(event['id'], type);
    }

    /**
    * handle permission validations if permission changing to private
    *
    *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    *
    */
    private _handlePermission(event, type): void {
        this.metadataForm.value['responsible'] !== this._defaultUserId ? document.getElementById('confirmPrivate').click() : this._updateSelectedValue(event['id'], type);
    }

    /**
     * Function calls on change of status, priority and responsible fields, saves updated data into the server
     *
     * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     *
     * @param id
     * @param label
     */
    private _updateSelectedValue(id: number, label: string): void {
        label === 'project' ? id = 1 : null;
        if (!!id) {
            const payload = {};
            if (!!this.updateDocumentId) {
                const metaData = this.metadataVariables.metadata;
                this.body[label] = metaData[label] = id;
                const metaDataKeys = ['status', 'priority', 'responsible', 'folder', 'sf_permission', 'handover_text'];
                metaDataKeys.forEach((dataKey) => {
                    payload[dataKey] = metaData[dataKey];
                });
                payload['deadline'] = this._getDeadline(id);
                payload['project_ids'] = this.metadataForm.value['project'].toString();
            } else {
                label === 'date' || label === 'time' ? payload['deadline'] = this._getDeadline(id) : label === 'project' ? payload['project_ids'] = this.metadataForm.value['project'].toString() : payload[label] = id;
            }
            this._subscriptions.add(this._apiService.put(`${MetadataUrls.METADATA.replace('{id}', this.documentId.toString())}`, payload).subscribe({
                next: (res) => {
                    if (this.updateDocumentId) {
                        this.metadataService.changePayload(payload);
                        this.saveMetadata.emit();
                    }
                    this.updateHistory();
                    this.metadataActions.fetchMetadata({ document_id: this.documentId });
                }, error: (err: any) => {
                    err['status'] === 403 || err['status'] === 400 ? (this.metadataActions.fetchMetadata({ document_id: this.documentId }), this._showNotification(err)) : null;
                    throw err;
                }
            }));
        }
    }

    /**
    * calculates deadline field by applying all validations
    *
    * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    *
    */
    private _getDeadline(id): void {
        let deadline;
        if (!!this.metadataForm.value.deadline_date['formatted'] && id !== 1) {
            if (!!this.metadataForm.value.deadline_time) { deadline = this.metadataForm.value.deadline_date['formatted'] + ' ' + this.metadataForm.value.deadline_time; } else {
                deadline = this.metadataForm.value.deadline_date['formatted'] + ' ' + '12:00';
            }
        } else { deadline = ''; }
        return deadline;
    }

    /**
   * show notificatin if getting error when saving metadata
   *
   * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   * @param err
   */
    private _showNotification(err): void {
        !!err['error']['data'] && err['error']['data']['folder'] ? this._notificationService.error('error', err['error']['data']['folder'])
            : !!err['error']['data']['deadline'] ? this._notificationService.error('error', err['error']['data']['deadline']) : null;
    }

    /**
   * updates history after saving metadata
   *
     *@author David Raja <david.ra@pitsolutions.com>
   *
   */
    public updateHistory() {
        this._historyActions.fetchHistoryData(this.payload);
    }
    /**
    * @author Vishnu B K <vishnu.bk@pitsolutions.com>
    *
    * Function to handle date changes
    */
    public onDateChanged(event: IMyDateModel): void {
        event['formatted'] = moment((event['epoc']) * 1000).format('YYYY-MM-DD');
        if (!!event['epoc']) {
            this.metadataForm.value.deadline_date = {
                formatted: event.formatted
            };
            !!this.metadataForm.value['deadline_time'] ? this._updateSelectedValue(2, 'date') : null;
        } else {
            this.metadataForm.value.deadline_date = {
                formatted: ''
            };
            this._updateSelectedValue(2, 'date');
        }
    }

    /**
    * Function executes on each time change triggers metadata save function on valid time updates
    *
    *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    *
    */
    public onTimeChange(event): void {
        !!this.metadataForm.value['deadline_date']['formatted'] ? !!this.metadataForm.value['deadline_time'] ? this._updateSelectedValue(2, 'time') : null : null;
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to fetch metadata template
     */
    private _fetchMetadataTemplate(): void {
        this._subscriptions.add(
            this._moduleEngineService.getTemplateData(10)
                .subscribe((res) => {
                    // tslint:disable-next-line:no-unused-expression
                    (!!res.data) && (this.metadataVariables.templateData = res.data);
                }));
    }

    /**
     * Function to fetch metadata details
     *
     *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     *
     */
    public _getMetadataDetils(): void {
        this._subscriptions.add(this.metadataService.getMetdataDetails().pipe(skip(1)).subscribe((res) => {
            this.metadataVariables.metadata = res['metadataDetails'];
            if (this.metadataVariables.metadata && this.metadataVariables.metadata['permission']) {
                this.isEditPermission = this.metadataVariables.metadata['permission'][2];
                this.metadataActions.updateUserPermissions(this.metadataVariables.metadata['permission']);
            }
            if (!!this.metadataVariables.metadata) {
                this._setMetaData(this.metadataVariables.metadata);
                this.metadataVariables['permissionData'].length === 0 ? this.triggerActions() : this._triggerUserFolderActions();
                this._getUserList();
                this._getDataByType('status');
                this._getDataByType('priority');
                this._getDataByType('permission');
                this._getDataByType('delegate');
                this._getDataByType('project');
            }
        })
        );
    }

    /**
      * checks wheather handover feature is enabled
      *
      *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
      *
      */
    public ishandoverEnabled() {
        !this._isprivate && !!this.metadataVariables.metadata && !!this.metadataVariables.metadata['permission'] && !!this.metadataVariables.metadata['permission'][5] && this.metadataForm.value['permission'] !== 2 ? (this.isModalEnabled = '#handoverModal', this._updatePermission(true))
            : (this.isModalEnabled = '', this._updatePermission(false));
        return this.isModalEnabled;
    }

    /**
      * updates permission
      *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
      *
      */
    private _updatePermission(value: boolean) {
        this.metadataService.chnageHandoverPermission(value);
    }

    /**
     * Function to trigger get status, priority and permission
     *
     *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     *
     */
    private triggerActions(): void {
        this.metadataActions.fetchStatus({});
        this.metadataActions.fetchPriority({});
        this.metadataActions.fetchDocumentPermission({});
        this._triggerUserFolderActions();
    }

    /**
     * Function to trigger get folder, users
     *
     *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     *
     */
    private _triggerUserFolderActions(): void {
        this.metadataActions.fetchDelegateTo({ module_id: this.moduleId });
        this.metadataActions.fetchUsers({ folder_id: this.metadataVariables.metadata['folder'], module_id: this.moduleId });
        this.metadataActions.fetchDocumentPermission({});
        this.metadataActions.fetchProject({});
        this._updateDeadline();
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function return data by type
     *
     * @param type
     */
    private _getDataByType(type?: string): void {
        if (!!this.metadataVariables[`${type}Data`].length) {
            this._patchListValue(type);
            return;
        }
        this._subscriptions.add(this.metadataService.getListDetails(`${type}`).subscribe((res) => {
            // const data = type === 'delegate' ? this.metadataVariables.metadata['reference']['folder'] : res[`${type}Details`];
            type === 'delegate' ? (this._folderDetails = res[`${type}Details`]) : null;
            const data = res[`${type}Details`];
            if (!!data) {
                this.metadataVariables[`${type}Data`] = data.map((list) => {
                    switch (`${type}`) {
                        case 'permission':
                            if (!this.metadataVariables.metadata['permission'][6] && list['id'] === 2) {
                                return {};
                            } else { return { id: list['id'], itemName: list['sfPermissionName'] }; }
                        case 'delegate':
                            return { id: list['node_id'], itemName: !!list['parent_name'] ? list['node_name'] + '(' + list['parent_name'] + ')' : list['node_name'] };
                        case 'project':
                            return { id: list['id'], itemName: !!list['parent_project_name'] ? list['name'] + '(' + list['parent_project_name'] + ')' : list['name'] };
                        default:
                            return { id: list['id'], itemName: list[`${type}`] };
                    }
                });
                type === 'delegate' ? this._getDefaultNode(this.metadataVariables.metadata) : null;
                this._patchListValue(type);
            }
        }));
    }

    /**
   * if user only has read permission, funtion add that node into folder list.
   *
   *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   */
    private _getDefaultNode(metadata) {
        if (!!metadata) {
            const id = this.metadataVariables.metadata['folder'];
            metadata['reference']['folder'].forEach(list => {
                if (list['node_id'] === id && !list['permissions'][4]) {
                    this.metadataVariables['delegateData'].push({ id: list['node_id'], itemName: !!list['parent_name'] ? list['node_name'] + '(' + list['parent_name'] + ')' : list['node_name'] });
                }
            });
        }
    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function patch list values by type
     *
     * @param type
     */
    private _patchListValue(type?: string): void {
        const showSelected = this.metadataVariables[`${type}Data`].filter((list) => {
            switch (`${type}`) {
                case 'permission':
                    return list['id'] === this.metadataVariables.metadata['sf_permission'];
                case 'delegate':
                    return list['id'] === this.metadataVariables.metadata['folder'];
                case 'project':
                    return list['id'] === this.metadataVariables.metadata['projects'][0]['id']
                default:
                    return list['id'] === this.metadataVariables.metadata[`${type}`];
            }
        });
        const patchValue = {};
        !!showSelected.length ? patchValue[`${type}`] = showSelected[0].id : null;
        type === 'project' ? this._updateProjectIds() : this.metadataForm.patchValue(patchValue);
    }

    /**
     * all project ids are pushed into array for patching
     *
     * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     *
     * @param params
     */
    private _updateProjectIds(): void {
        const project_ids = [];
        this.metadataVariables.metadata['projects'].forEach(element => {
            project_ids.push(element['id']);
        });
        this.metadataForm.patchValue({ project: project_ids });
    }

    /**
     * Function to get userlist values from server and update into the view
     *
     * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     * @modified Akhil K <akhil.kn@pitsolutions.com>
     */
    private _getUserList(): void {
        if (!!this.metadataVariables.responsibleData.length) {
            this._patchListValue('responsible');
            return;
        }
        this.metadataService.getListDetails('responsible').subscribe((res) => {
            const data = res['usersDetails'];
            let isRespAvalil = false;
            if (!!data) {
                this.metadataVariables.responsibleData = data['users'].map((list) => {
                    list['id'] === this.metadataVariables.metadata['responsible'] ? isRespAvalil = true : null;
                    return { id: list['id'], itemName: list['name'] };
                });
                !isRespAvalil ? this.metadataVariables.responsibleData.push({ id: this.metadataVariables.metadata['responsible'], itemName: this.metadataVariables.metadata['responsible_by_name'] }) : null;
                this._patchListValue('responsible');
            }
        });
    }

    /**
     * Function to update metdata in the view.
     *
     * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
     *
     * @param params
     */
    private _setMetaData(metadata: object): void {
        this.body = {
            status: metadata['status'],
            priority: metadata['priority'],
            responsible: metadata['responsible']
        };
        const createData = !!metadata['created']['on'] ? this.dateFormatPipe.transform(metadata['created']['on']) + ' ' + metadata['created']['short_name'] : '';
        let editedData = !!metadata['modified']['on'] ? this.dateFormatPipe.transform(metadata['modified']['on']) + ' ' + metadata['modified']['short_name'] : '';
        editedData = editedData.trim();
        if (editedData === 'null' || editedData === null || editedData === 'undefined') {
            editedData = ' ';
        }
        const docNumber = metadata['sf_number'];
        const handoverText = metadata['handover_text'];
        this.metadataVariables.created$ = !!createData ? createData : '';
        this.metadataVariables.edited$ = editedData;
        this.metadataVariables.documentNumber = !!docNumber ? docNumber : '';
        this.metadataVariables.notes = !!handoverText ? handoverText : '';
    }

    /**
  * updates deadline filed on metadata updation
  *
  *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
  *
  */
    private _updateDeadline(): void {
        if (!!this.metadataVariables.metadata['deadline']) {
            const date = this._convertTimeStamptoDate(this.metadataVariables.metadata['deadline']);
            this.patchDate(date, 'deadline_date');
            !!this.metadataVariables.metadata['deadline'] ? this.metadataForm.patchValue({ deadline_time: moment.unix(this.metadataVariables.metadata['deadline']).tz(this._timezone).format('HH:mm') }) : null;
        } else {
            this.metadataForm.patchValue({ deadline_time: '' });
            this.metadataForm.patchValue({ deadline_date: '' });
        }
    }


    /**
    * @author Vishnu B K <vishnu.bk@pitsolutions.com>
    *
    * Function to patch date to form
    */
    public patchDate(date: string, field: string): void {
        if (!!date) {
            const metadataForm = this.metadataForm;
            const value = date.split('-');
            const m = +value[1];
            const d = +value[2];
            metadataForm.controls[field].patchValue({
                date: {
                    year: value[0],
                    month: m,
                    day: d
                },
                formatted: date
            });
        } else {
            return null;
        }
    }

    /**
    * @author Vishnu B K <vishnu.bk@pitsolutions.com>
    *
    * Function to convert timestamp to date
    */
    private _convertTimeStamptoDate(timestamp: number): string {
        if (!!timestamp) {
            if (!!this.timeDifference && this.timeDifference !== null) {
                return moment(timestamp * 1000).utcOffset(this.timeDifference).format('YYYY-MM-DD');
            }
        }
        return null;
    }
    /**
    * Function to unsuscribe all the subscriptions.
    *
    *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
    *
    */
    ngOnDestroy() {
        this._prefillValue();
        this._subscriptions.unsubscribe();
    }
}



