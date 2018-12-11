import { Component, OnInit, Input, OnDestroy, OnChanges, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MetadataVariables, Body } from '../../models/metadataList.model';

import { MetadataService } from '../../services/metadata.service';
import { MetadataActions } from '../../store/metadata.actions';
import { ModuleEngineService } from './../../../../common/module_engine/services/module-engine.service';
import { HistoryService } from '../../services/history.service';
import { HistoryActions } from '../../store';
import { DropdownSettings } from '../../../scayla-select/ca-select.interface';
import { IMyDpOptions, IMyDateModel } from '../../../ngx-datepicker';
import * as moment from 'moment';
import { openDropDown } from '../../../scayla-select';

let that;
@Component({
  selector: 'app-create-metadata',
  templateUrl: './create-metadata.component.html',
  styleUrls: ['./create-metadata.component.scss']
})
export class CreateMetadataComponent implements OnInit, OnDestroy, OnChanges {
  @Input() moduleId: number;
  @Input() documentId: number;
  @Input() isSent: boolean;
  @Input() isSave: boolean;
  @Input() isFlag: boolean;
  @Output()
  public saveMetadata: EventEmitter<object> = new EventEmitter();

  private date = new Date();
  public body: Body = {};
  public payload: any;
  public metadataVariables: MetadataVariables = {};
  public metadataForm: FormGroup;
  private subscriptions = new Subscription();
  public contactId: number;
  public defaultNodeId: number;
  public MetadataDefaultValues = {};
  public dropdownSettings: DropdownSettings;
  public projectCloneSettings: DropdownSettings;
  public priorityFlag = { 'priority': [] };
  public errorMessage$: string;
  public timeDifference: string;
  public confMessage$ = 'confirmation';
  private _defaultUserId = JSON.parse(localStorage.getItem('DEFAULT_CONTACT_ID'));
  private _currentUserId: number;
  private _prevUserId: number;
  private _isResp: boolean;
  private folderDetails: {};
  private _currentFolderId;

  myOptions: IMyDpOptions = {
    dateFormat: localStorage.getItem('dateformat'),
    disableUntil: { day: new Date(Date.now() - 864e5).getDate(), month: this.date.getDate() === 1 ? this.date.getMonth() : this.date.getMonth() === 1 ? 1 : this.date.getMonth() + 1, year: this.date.getFullYear() }

  };

  constructor(
    private _fb: FormBuilder,
    private _historyActions: HistoryActions, private _historyService: HistoryService,
    private metadataActions: MetadataActions,
    private metadataService: MetadataService,
    private _moduleEngineService: ModuleEngineService
  ) {
    that = this;
  }

  /**
   * Invokes all the functions those should call initially.
   *
   *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   */
  ngOnInit() {
    this._initVariables();
    this.getMetadataDetils();
    this.MetadataDefaultValues = { 'responsible': JSON.parse(localStorage.getItem('DEFAULT_CONTACT_ID')), 'sf_permission': 1, 'status': 1, 'priority': 1, 'folder': '', 'project_ids': '', 'deadline': '' };
    this._addSubscriptios();
    this.timeDifference = localStorage.getItem('timeDiff');
  }

  /**
* function to add intial subscriptions
*
*@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
*/
  private _addSubscriptios() {
    this._historyService.currentPayload.subscribe(payload => this.payload = payload);
  }

  /**
   * Function to detect contact id change and trigger functions for updating datas
   *
   *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   * @param changes
   */
  ngOnChanges(changes: object): void {
    this._onInputChange(changes);
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
    if (!!this.documentId) {
      this._saveMetadata();
    }
    if (!!this.isSent) {
      this._afterMetadataSave();
    }
    if (!!this.isFlag) {
      this.MetadataDefaultValues['priority'] = 2;
      this._getPrivateData();
      this.metadataForm.patchValue({ priority: 2 });
      this.isFlag = false;
    }
  }

  /**
 * get priority high value and id from store and update in variable for ngselect updation.
 *
 *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 */
  private _getPrivateData(): void {
    this.metadataService.getListDetails('priority').subscribe((res) => {
      Object.keys(res['priorityDetails']).forEach(val => {
        if (res['priorityDetails'][val]['id'] === 2) {
          that.priorityFlag['priority'].push({ 'id': res['priorityDetails'][val]['id'], 'itemName': res['priorityDetails'][val]['priority'] });
        }
      });
    });
  }

  /**
* function to handle confirmation popup
*
*@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
*/
  public handleConfirm(result): void {
    if (!!result) {
      !!this._isResp ? (this.metadataForm.patchValue({ responsible: this._currentUserId }), this.MetadataDefaultValues['responsible'] = this._currentUserId, this._isResp = false)
        : (this.metadataForm.patchValue({ permission: 2 }), this.MetadataDefaultValues['sf_permission'] = 2);
    } else {
      !!this._isResp ? (this.metadataForm.patchValue({ responsible: this._prevUserId }), this.MetadataDefaultValues['responsible'] = this._prevUserId, this._isResp = false)
        : (this.metadataForm.patchValue({ permission: 1 }), this.MetadataDefaultValues['sf_permission'] = 1);
    }
  }

  /**
 * Function to initialize variables
 *
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 */
  private _initVariables(): void {
    this._initScaylaSelect();
    this.metadataVariables = { statusData: [], priorityData: [], responsibleData: [], delegateData: [], permissionData: [], projectData: [], created$: '', edited$: '', documentNumber: '' };
    this._fetchMetadataTemplate();
  }
  private _initScaylaSelect(): void {
    this.dropdownSettings = {
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
    this.metadataVariables.documentNumber = '';
    this.metadataVariables.notes = '';
  }

  /**
 * Function to get changes from status, priority and responsible fields for updating those in server
 *
 *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 */
  public selected(event, type?: string): void {
    type === 'project' ? this.MetadataDefaultValues['project_ids'] = this.metadataForm.value.project.toString() : null;
    type === 'folder' ? (this._fetchUserList(event['id']), this._currentFolderId = event['id'], this.metadataActions.fetchDocumentPermission({})) : null;
    type !== 'deadline' && type !== 'sf_permission' && type !== 'responsible' ? this._updateSelectedValue(+event['id'], type) : null;
    type === 'sf_permission' ? event['id'] === 1 ? this._updateSelectedValue(+event['id'], type) : this._validatePermission(event, type) : null;
    type === 'responsible' ? this.MetadataDefaultValues['sf_permission'] === 2 ? this.validteResponsible(event, type) : this._updateSelectedValue(+event['id'], type) : null;
  }

  /**
* handles confirmation popup when permission changes to private when another user as responsible
*
*@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
*/
  private _validatePermission(event, type?: string) {
    this.MetadataDefaultValues['responsible'] === this._defaultUserId ? this._updateSelectedValue(+event['id'], type) : document.getElementById('test').click();
  }

  private validteResponsible(event, type?: string) {
    this._isResp = true;
    this._currentUserId = event['id'];
    this._prevUserId = this.MetadataDefaultValues['responsible'];
    this._defaultUserId !== event['id'] ? document.getElementById('test').click() : this._updateSelectedValue(+event['id'], type);
  }
  /**
   * Function calls on change of status, priority and responsible fields, saves updated data into the server
   *
   * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   * @param id
   * @param label
   */
  private _updateSelectedValue(id?: number, label?: string): void {
    // tslint:disable-next-line
    if (!!id && this.body[label] != id) {
      this.MetadataDefaultValues[label] = +id;
    }
  }

  /**
  * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
  *
  * Function to save metadata
  */
  public _saveMetadata(): void {
    if (!this.isSave) {
      this.MetadataDefaultValues['status'] = 3;
    }
    this.saveMetadata.emit(this.MetadataDefaultValues);
  }

  /**
  * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
  *
  * Function calls after metadata saved
  */
  private _afterMetadataSave(): void {
    this._prefillValue();
    this._historyActions.fetchHistoryData(this.payload);
    this.isSent = false;
    this.MetadataDefaultValues = {};
  }


  /**
   * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   * Function to fetch metadata template
   */
  private _fetchMetadataTemplate(): void {
    this.subscriptions.add(
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
  public getMetadataDetils(): void {
    this._triggerActions();
    this._getUserList();
    this._getDataByType('status');
    this._getDataByType('priority');
    this._getDataByType('permission');
    this._getDataByType('delegate');
    this._getDataByType('project');
  }

  /**
   * Function to trigger get status, priority and users
   *
   *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   */
  private _triggerActions(): void {
    this.metadataActions.fetchDelegateTo({ module_id: this.moduleId });
    this.metadataActions.fetchStatus({});
    this.metadataActions.fetchPriority({});
    this.metadataActions.fetchDocumentPermission({});
    this.metadataActions.fetchProject({});
  }

  /**
   * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   * Function return data by type
   *
   * @param type
   */
  private _getDataByType(type?: string): object {
    if (!!this.metadataVariables[`${type}Data`].length) {
      this._patchListValue(type);
      return;
    }
    this.subscriptions.add(this.metadataService.getListDetails(`${type}`).subscribe((res) => {
      const data = res[`${type}Details`];
      type === 'delegate' ? this.folderDetails = res[`${type}Details`] : null;
      if (!!data) {
        this.metadataVariables[`${type}Data`] = data.map((list) => {
          switch (`${type}`) {
            case 'permission':
              if (!this._isFolderPrivate(this._currentFolderId) && list['id'] === 2) {
                return {};
              } else { return { id: list['id'], itemName: list['sfPermissionName'] }; }
            case 'delegate':
              this._getDefaultNodeId(list);
              return { id: list['node_id'], itemName: !!list['parent_name'] ? list['node_name'] + '(' + list['parent_name'] + ')' : list['node_name'] };
            case 'project':
              return { id: list['id'], itemName: !!list['parent_project_name'] ? list['name'] + '(' + list['parent_project_name'] + ')' : list['name'] };
            default:
              return { id: list['id'], itemName: list[`${type}`] };
          }
        });
        this._patchListValue(type);
      }
    }));
  }

  /**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function patch list values by type
 *
 * @param value
 */
  private _getDefaultNodeId(value: object): void {
    if (!!value && !value['is_display']) {
      this.MetadataDefaultValues['folder'] = value['node_id'];
      this._fetchUserList(this.MetadataDefaultValues['folder']);
    }
  }

  /**
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
* trigger action to fetch users according to the selected node id
*
* @param folderId
*/
  private _fetchUserList(folderId: number): void {
    this.metadataActions.fetchUsers({ folder_id: folderId, module_id: this.moduleId });
  }

  /**
   * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   *
   * Function patch list values by type
   *
   * @param type
   */
  private _patchListValue(type?: string): void {
    const showSelected = this.metadataVariables[`${type}Data`].filter((list) => {
      switch (`${type}`) {
        case 'permission':
          return list['id'] === this.MetadataDefaultValues['sf_permission'];
        case 'delegate':
          return list['id'] === this.MetadataDefaultValues['folder'];
        case 'responsible':
          return list['id'] === this.MetadataDefaultValues['responsible'];
        case 'status':
          return list['id'] === this.MetadataDefaultValues['status'];
        case 'priority':
          return list['id'] === this.MetadataDefaultValues['priority'];
      }
    });

    const patchValue = {};
    if (showSelected.length > 0) { patchValue[`${type}`] = showSelected[0]['id']; }
    this.moduleId === 5 && type === 'delegate' ? this.metadataForm.patchValue({ delegate: null }) : type === 'responsible' ? this._patchResponsible(patchValue) : this.metadataForm.patchValue(patchValue);
  }

  private _isFolderPrivate(id: number) {
    if (!this._currentFolderId) {
      return true;
    }
    if (!!this.folderDetails) {
      let isPrivate;
      Object.keys(this.folderDetails).forEach(val => {
        this.folderDetails[val]['node_id'] === id ? (isPrivate = this.folderDetails[val]['permissions'][6]) : null;
      });
      return isPrivate;
    }
  }

  /**
  * Function to get userlist values from server and update into the view
  *
  * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
  */
  private _patchResponsible(patchValue: object): void {
    !patchValue['responsible'] ? (this.metadataForm.patchValue({ responsible: null }), openDropDown('responsible')) : this.metadataForm.patchValue(patchValue);
    !patchValue['responsible'] && !!this.MetadataDefaultValues['responsible'] ? this.MetadataDefaultValues['responsible'] = '' : null;
  }

  /**
   * Function to get userlist values from server and update into the view
   *
   * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
   */
  private _getUserList(): void {
    this.metadataService.getListDetails('responsible').subscribe((res) => {
      const data = res['usersDetails'];
      if (!!data) {
        this.metadataVariables.responsibleData = data['users'].map((list) => {
          return { id: list['id'], itemName: list['name'] };
        });
        this._patchListValue('responsible');
      }
    });
  }

  /**
  * Validate save by checking responsible field and calculating deadline field.
  *
  *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
  *
  */
  public validateSave() {
    !!this.metadataForm.value.deadline_date['formatted'] ? this.MetadataDefaultValues['deadline'] = this.metadataForm.value.deadline_date['formatted'] + ' ' + '00' + ':' + '00' : this.MetadataDefaultValues['deadline'] = '';
    return this.MetadataDefaultValues['responsible'];
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
  * Function to unsuscribe all the subscriptions.
  *
  *@author Sreekanth mn <sreekanth.mn@pitsolutions.com>
  *
  */
  ngOnDestroy(): void {
    this.metadataVariables = {};
    this._prefillValue();
    // this.subscriptions.unsubscribe();
  }
}
