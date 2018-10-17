

import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/field-config.interface';
import { FormGroup } from '@angular/forms';
import { ApiService, HelperService } from '../../../../../core/services';

@Component({
    selector: 'app-auto-complete-renderer',
    templateUrl: './auto-complete-renderer.component.html',
    styleUrls: ['./auto-complete-renderer.component.scss']
})
export class AutoCompleteRendererComponent implements OnInit {
    public config: FieldConfig;
    public group: FormGroup;
    public items: Array<Object>;
    public copy: FieldConfig;
    public formindex: number;
    constructor(private apiService: ApiService, private helperService: HelperService) { }

    ngOnInit() {
        this._init();
    }

    _init() {

        this._manageCloning();
    }

    /**
    * function to get current module from local storage
    *
    * @author Vishnu BK<vishnu.bk@pitsolutions.com>
    */
    public getCurrentModule(): any {
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
            if (config.field_validation['is_zipcode']) {
                validatorArray.push(this.helperService.validateZipcode);
            }
            group.controls[$controlName].setValidators(validatorArray);
        }

    }

    /**
       * Change event in ng select to load zipcode
       * @param event
       *
       * @author Vishnu BK<vishnu.bk@pitsolutions.com>
    */
    public onChange(event): void {
        if (!!this.copy['field_api'] && 'onchange' in this.copy['field_api']) {
            if (event.length >= 2) {
                this.apiService.get(this.copy['field_api']['onchange']['url'] + event).take(1).subscribe({
                    next: (res) => {
                        this.items = [];
                        if (Object.keys(res.data).length !== 0) {
                            res.data.map(val => {
                                this.items = [...this.items, ...[{ id: val['zipcode_id'], text: val['zipcode'] }]];
                            });
                        }
                    }, error: (error) => {
                        throw error;
                    }
                });
            } else {
                this.items = [];
            }
        }
    }

    public onSelect(event): void {
        if (!!this.copy['field_api'] && 'onchange' in this.copy['field_api']) {
            if (!!event['text'] && event['text'].length >= 2) {
                this.apiService.get(this.copy['field_api']['onchange']['url'] + event['text']).take(1).subscribe({
                    next: (res) => {
                        this.items = [];
                        const groupControls = this.group.controls;
                        const field_name = this.copy.field_name;
                        if (!!event['id'] && Object.keys(res.data).length >= 1) {
                            const data = !!res.data[0]['zipcode_id'] ? res.data.filter(result => result['zipcode_id'] === event['id'])[0] : res.data[0];
                            if ('fields' in this.copy['field_api']['onchange']) {
                                const fields = this.copy['field_api']['onchange']['fields'];
                                const patchValue = () => {
                                    fields.forEach((field) => {
                                        const fieldGroup = groupControls[`${field['field_name']}`];
                                        switch (field.field_type) {
                                            case 'textfield':
                                                fieldGroup.patchValue(data[`${field['data_text_key']}`]);
                                                break;
                                            case 'ng2selectbox':
                                                fieldGroup.patchValue([{ id: data[`${field['data_id_key']}`], text: data[`${field['data_text_key']}`] }]);
                                                break;
                                            default:
                                                fieldGroup.patchValue('');
                                        }
                                    });
                                };
                                patchValue();
                            }
                        }
                        // tslint:disable-next-line:no-unused-expression
                        !!event['text'] && groupControls[`${field_name}`].patchValue({ id: event['text'], text: event['text'] });
                    }, error: (error) => {
                        throw error;
                    }
                });
            }
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
        this._setValidators(this.copy, this.group);
        this._patchFormValue(this.copy, this.group);

    }

    private _patchFormValue(config: FieldConfig, group: FormGroup): void {
        if (!config || !group) {
            return null;
        }
        const patchValue = { id: config.field_value, text: config.field_value };
        if (config.field_value) {
            (group.controls[config['index']]) ?
                group.controls[config['index']].patchValue(patchValue) :
                group.controls[config['field_name']].patchValue(patchValue);
        }
    }
}
