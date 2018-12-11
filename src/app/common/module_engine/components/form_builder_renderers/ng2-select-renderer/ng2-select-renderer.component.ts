import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectModule } from 'ng2-select';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from '../../../../../core/services/index';
import { SelectBox } from '../../../models/selectbox.interface';
import { Field } from '../../../models/field.interface';
import { FieldConfig } from '../../../models/field-config.interface';


@Component({
    selector: 'app-ng2-select-renderer',
    templateUrl: './ng2-select-renderer.component.html',
    styleUrls: ['./ng2-select-renderer.component.scss']
})
export class Ng2SelectRendererComponent implements OnInit {
    public config: FieldConfig;
    public group: FormGroup;
    public formindex: number;
    public items: Array<Object>;
    public copy: FieldConfig;
    public dataLoaded = false;
    public value: Object;
    public isGray = true;
    public disabled = true;
    public titlePatchValue: Array<object>;
    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this._init();
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
     * Function to init all the functions
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */

    private _init() {
        this._manageCloning();
        this.items = [{ id: 1, text: '' }];
        if (this.copy.field_name.substring(0, 7) !== 'im_type') {
            this._fetchDataAndPopulateTheField(this.config);
        } else {
            this.createIMMessengerData(this.config);
        }


    }

    /**
     * Function to fetch data from the backend and populate the select box field
     * @param config;
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _fetchDataAndPopulateTheField(config: FieldConfig, id?: number) {
        this.onListen();
        if (!config || !config['field_api']) {

            return null;
        }
        let api_url = this.copy['field_api']['onload']['url'];
        api_url = !id ? api_url : api_url + id;
        this.apiService.get(api_url).take(1).subscribe({
            next: (res) => {
                this.dataLoaded = true;
                if (!!res.data.states) {
                    this.items = this._populateStateSelectBox(res.data.states.list);
                } else if (!!res.data.list) {
                    this.items = this._populateSelectBox(res.data.list);
                } else if (!!res.data) {
                    this.items = this._populateSelectBox(res.data);
                }
                (!this.copy.field_value) ?
                    this._patchClusterField(this.group.controls[this.copy.field_name]) :
                    this._patchFormValue(this.config, this.group);
            }, error: (error) => {
                throw error;
            }
        });
    }


    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to patch cluster field
     *
     * @param field_control
     */
    private _patchClusterField(field_control: any): void {
        const field_value = field_control.value;
        const fieldControl = field_control;
        const patchValue = this.items.filter(item => `${item['id']}` === field_value);
        patchValue.length ?
            fieldControl.patchValue(patchValue) :
            fieldControl.patchValue([{ id: field_value, text: this.copy.field_placeholder }]);
    }

    /**
     * Function to load State selectbox value
     *
     * @param data
     *
     * @author Vishnu.bk <vishnu.bk@pitsolutions.com>
     */
    _populateStateSelectBox(data) {
        if (!!data && typeof data === 'object' && data.length > 0) {
            const array: Array<SelectBox> = data.map((item) => {
                if (item['active']) {
                    const values = Object.entries(item);
                    const field = values[2][1];
                    const items = { id: item['id'], text: `${field}` };
                    this.disabled = false;
                    return items;
                }
            });
            return array;
        } else {
            return null;
        }
    }

    /**
     * This function will populate the IMAddress
     *
     * @param config
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private createIMMessengerData(config: FieldConfig): void {
        if (!config) {
            return null;
        }
        this.dataLoaded = true;
        const fieldOptions = config['field_options'];
        this.items = fieldOptions.map((item, index) => {
            const m = { id: index + 1, text: item };
            return m;
        });
        // tslint:disable-next-line:no-unused-expression
        (!this.copy.field_value) && this._patchClusterField(this.group.controls[this.copy.field_name]);
        this.disabled = false;
    }

    /**
     * Function to populate data in select box
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     *
     */
    private _populateSelectBox(data: Array<Object>): Array<SelectBox> {
        if (!!data && typeof data === 'object' && data.length > 0) {
            const array: Array<SelectBox> = data.map((item) => {
                if (item) {
                    const values = Object.entries(item);
                    const field = (values.length === 3) ? values[values.length - 1][1] : values[1][1];
                    const items = { id: item['id'], text: `${field}` };
                    this.disabled = false;
                    if (!!items) {
                        if ('active' in item) {
                            if (item['active']) {
                                return items;
                            }
                        } else {
                            return items;
                        }
                    }
                }
            });
            return array.filter((val) => !!val);
        } else {
            return null;
        }
    }

    public removed($event: any): void {
        this.group.controls[this.config.field_name].patchValue([{ id: '', text: this.copy.field_placeholder }]);
    }

    public refreshValue($event: any): void {
        const selectedText = ($event[0] && $event[0]['text']) ? $event[0]['text'] : $event['text'];
        this.titlePatchValue = selectedText;
        if (selectedText !== this.copy.field_placeholder) {
            this.isGray = false;
        } else {
            this.isGray = true;
        }
    }
    /**
     * Function to listen other fields
     *
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     */
    public onListen(): void {
        if (!!this.copy['field_api'] && 'onListen' in this.copy['field_api']) {
            const listenData = this.copy['field_api']['onListen'];
            this.group.controls[`${listenData['field_name']}`].valueChanges.subscribe((val) => {
                if (!!val) {
                    const queryParamValue = listenData['field_type'] === 'ng2selectbox' ? !!val[0] && val[0]['id'] : val;
                    if (!!queryParamValue) {
                        let api_url = listenData['url'];
                        api_url = !queryParamValue ? api_url : api_url + queryParamValue;
                        this.apiService.get(api_url).take(1).subscribe({
                            next: (result) => {
                                if (!!result.data.states) {
                                    this.items = this._populateStateSelectBox(result.data.states.list);
                                }
                            }, error: (error) => {
                                throw error;
                            }
                        });
                    }
                }
            });
        }
    }

    /**
    * This function will patch the field value to control
    * @param config
    * @param group
    *
    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _patchFormValue(config: FieldConfig, group: FormGroup): void {

        if (!config || !group) {
            return null;
        }
        const patchValue = this.items.filter(res => `${res['id']}` === config.field_value);
        if (config.field_value && patchValue.length) {
            (group.controls[config['index']]) ?
                group.controls[config['index']].patchValue(patchValue) :
                group.controls[config['field_name']].patchValue(patchValue);
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
    }

}
