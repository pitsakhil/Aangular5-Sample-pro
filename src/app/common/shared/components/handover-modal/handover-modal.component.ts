import { Component, OnInit, AfterViewInit, AfterContentInit, OnChanges, EventEmitter, OnDestroy, Input, Output } from '@angular/core';
import { IMyDpOptions, IMyDateModel } from '../../../ngx-datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DropdownSettings } from '../../../scayla-select/ca-select.interface';
import { MetadataService } from '../../services/metadata.service';
import { MetadataVariables } from '../../models/metadataList.model';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from '../../../../core/services';
import { HandoverUrls } from '../../constants/config';
import { NotificationService } from '../../../notification/services/notification.service';
import * as moment from 'moment';
import { MetadataActions, HandoverHistoryActions } from '../../store';

@Component({
  selector: 'app-handover-modal',
  templateUrl: './handover-modal.component.html',
  styleUrls: ['./handover-modal.component.scss']
})
export class HandoverModalComponent implements OnInit, OnDestroy, OnChanges {
  private date = new Date();
  @Input() documentId: number;
  @Output()
  public updateHistory: EventEmitter<object> = new EventEmitter();
  public minutesList = [{ id: '00', itemName: '00' }, { id: '30', itemName: '30' }];
  myOptions: IMyDpOptions = {
    allowDeselectDate: true,
    editableDateField: false,
    dateFormat: localStorage.getItem('dateformat'),
    disableUntil: { day: new Date(Date.now() - 864e5).getDate(), month: this.date.getDate() === 1 ? this.date.getMonth() : this.date.getMonth() === 1 ? 1 : this.date.getMonth() + 1, year: this.date.getFullYear() }
  };
  public addHandOverForm: FormGroup;
  public singleDropdown: DropdownSettings;
  public metadataVariables: MetadataVariables = {};
  private _subscriptions = new Subscription();
  public timeDifference: string;
  public errorMessage$: string;
  private _timezone = localStorage.getItem('timezone');
  public disableSave: boolean;
  constructor(private _fb: FormBuilder,
    private metadataService: MetadataService,
    private _apiService: ApiService,
    private notificationService: NotificationService,
    private metadataActions: MetadataActions,
    private _handoverHistoryActions: HandoverHistoryActions
  ) {
  }

  ngOnInit(
  ) {
    this.addHandOverForm = this._initHandOverForm();
    this._initScaylaSelect();
    this._getMetadataDetails();
  }

  ngOnChanges(simpleChanges) {
    this.timeDifference = localStorage.getItem('timeDiff');
    this.disableSave = false;
  }

  /**
  * @author Vishnu B K <vishnu.bk@pitsolutions.com>
  *
  * Function to initialize hand over form
  */
  public _initHandOverForm(): FormGroup {
    return this._fb.group({
      handover_to: ['', [Validators.required]],
      deadline_date: [''],
      deadline_time: [''],
      notes: ['']
    });
  }

  /**
  * @author Vishnu B K <vishnu.bk@pitsolutions.com>
  *
  * Function to initialize nscayla select
  */
  private _initScaylaSelect(): void {
    this.singleDropdown = {
      singleSelection: true,
      enableSearchFilter: true,
      clearEnabled: false,
      text: ''
    };
  }

  /**
  * @author Vishnu B K <vishnu.bk@pitsolutions.com>
  *
  * Function to get handover details
  */
  public _getMetadataDetails(): void {
    this._subscriptions.add(this.metadataService.getMetdataDetails().subscribe((res) => {
      this.metadataVariables.metadata = res['metadataDetails'];
      if (!!this.metadataVariables.metadata) {
        this._getUserList();
        this._patchValueToForm(this.metadataVariables.metadata);
      }
    })
    );
  }

  /**
  * @author Vishnu B K <vishnu.bk@pitsolutions.com>
  *
  * Function to get user list to populate on select box
  */
  private _getUserList(): void {
    this.metadataService.getListDetails('responsible').subscribe((res) => {
      const data = res['usersDetails'];
      if (!!data) {
        this.metadataVariables.responsibleData = data['users'].map((list) => {
          return { id: list['id'], itemName: list['name'] };
        });
      }
    });
  }

  /**
  * @author Vishnu B K <vishnu.bk@pitsolutions.com>
  *
  * Function to patch value to form
  */
  public _patchValueToForm(data) {
    const deadline = this._convertTimeStamptoDate(data.deadline);
    this.addHandOverForm.patchValue({
      handover_to: data.responsible
    });
    !!data.deadline
      ? (this.patchDate(deadline, 'deadline_date'), this.addHandOverForm.patchValue({ deadline_time: moment.unix(data.deadline).tz(this._timezone).format('HH:mm') }))
      : (this.addHandOverForm.controls['deadline_date'].reset(), this.addHandOverForm.patchValue({ deadline_time: '' }));
  }

  public closeModal() {
    this.addHandOverForm.reset();
    this._patchValueToForm(this.metadataVariables.metadata);
  }

  /**
  * @author Vishnu B K <vishnu.bk@pitsolutions.com>
  *
  * Function to patch date to form
  */
  public patchDate(date, field): void {
    if (!!date) {
      const addHandOverForm = this.addHandOverForm;
      const value = date.split('-');
      const m = +value[1];
      const d = +value[2];
      addHandOverForm.controls[field].patchValue({
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
  * @author Vishnu B K <vishnu.bk@pitsolutions.com>
  *
  * Function to handle date changes
  */
  public onDateChanged(event: IMyDateModel): void {
    event['formatted'] = moment((event['epoc']) * 1000).format('YYYY-MM-DD');
    this.addHandOverForm.value.deadline_date = {
      formatted: event.formatted
    };
  }

  /**
  * @author Vishnu B K <vishnu.bk@pitsolutions.com>
  *
  * Function to submit form
  */
  public submitForm(model: FormGroup) {
    this.disableSave = true;
    model.value.notes === null ? model.value.notes = '' : null;
    const deadline = this._getDeadline(model);
    const payload = {
      responsible: model.value.handover_to,
      deadline: deadline,
      text: model.value.notes
    };
    this._subscriptions.add(this._apiService.put(`${HandoverUrls.HANDOVER.replace('{id}', this.documentId.toString())}`, payload).subscribe({
      next: (res) => {

        this.metadataActions.fetchMetadata({ document_id: this.documentId });
        this._handoverHistoryActions.fetchHistoryData({ document_id: this.documentId });
        this.notificationService.success('success', res.message);
        this.updateHistory.emit();
        const closeButton = document.getElementsByClassName('closeHandover');
        closeButton[0]['click']();
        closeButton[1]['click']();
        this.disableSave = false;
      }, error: (err: any) => {
        this.disableSave = false;
        !!err['error']['data']['deadline'] ? this.notificationService.error('error', err['error']['data']['deadline']) : this.notificationService.error('error', err['error']['message']);
        throw err;
      }
    }));
  }

  /**
  * calculates deadline field by applying all validations
  *
  * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
  *
  */
  private _getDeadline(model) {
    const deadlineTime = !!model.value['deadline_time'] ? ' ' + model.value['deadline_time'] : null;
    const deadline = !!model.value.deadline_date && !!deadlineTime ? moment(model.value.deadline_date.formatted).format('YYYY-MM-DD') + deadlineTime : '';
    return deadline;
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
