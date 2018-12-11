import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/field-config.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IMyDpOptions } from '../../../../ngx-datepicker';
import { HelperService } from '../../../../../core/services';
import { DateFormatPipe } from './../../../../../common/shared/pipes/date-format.pipe';

@Component({
    selector: 'app-date-renderer',
    templateUrl: './date-renderer.component.html',
    styleUrls: ['./date-renderer.component.scss'],
    providers: [DateFormatPipe]
})
export class DateRendererComponent implements OnInit {
    public config: FieldConfig;
    public group: FormGroup;
    private date = new Date();
    public copy: FieldConfig;
    public formindex: number;
    myOptions: IMyDpOptions = {
        dateFormat: localStorage.getItem('dateformat'),
        disableSince: { day: this.date.getDate(), month: this.date.getMonth() + 1, year: this.date.getFullYear() }
    };

    constructor(private formBuilder: FormBuilder, private helperService: HelperService, private dateFormatPipe: DateFormatPipe) { }

    ngOnInit() {
        this._manageCloning();
        this._init();
    }

    _init() {
        //this._setValidators(this.config, this.group);

    }

    /**
    * function to get current module from local storage
    *
    * @author Vishnu BK<vishnu.bk@pitsolutions.com>
    */
    getCurrentModule() {
        return localStorage.getItem('currentModule');
    }

    /**
    * function to add validations
    * @param config
    * @param group
    *
    * @author Vishnu BK<vishnu.bk@pitsolutions.com>
    */
    private _setValidators(config: FieldConfig, group: FormGroup): void {
        if (!config || !group) {
            return;
        }
        const $controlName: string = config['field_name'];
        const validatorArray = [];
        if (config.field_validation) {
            if (config.field_validation['is_date']) {
                validatorArray.push(this.helperService.validateDate);
            }
            group.controls[$controlName].setValidators(validatorArray);
        }

    }

    /**
     * Function to patch date value
     *
     * @author Vishnu.bk <vishnu.bk@pitsolutions.com>
     */
    setDate(config): void {
        const value = config['field_value'];
        if (!!value && value !== '') {
            const val = value.indexOf('/') !== -1 ? value.split('/') : value.split('.');
            this.group.controls[this.config.field_name].patchValue({
                date: {
                    year: val[2],
                    month: +val[+!(value.indexOf('/') !== -1)],
                    day: +val[+(value.indexOf('/') !== -1)]
                },
                formatted: this.dateFormatPipe.dateFormat(value)
            });
        }
    }

    /**
     * This function will handle the cloning in select control
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _manageCloning() {
        this.copy = JSON.parse(JSON.stringify(this.config));
        const cloneTitle = localStorage.getItem('cloning');
        localStorage.removeItem('cloning');
        if (cloneTitle) {
            if (this.copy['field_title']) {
                this.copy['field_title'] = cloneTitle;
            }
        }
        this.setDate(this.config);
        // this._setValidators(this.copy, this.group);
    }

}
