import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ApiService } from '../../../core/services/api.service';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ModuleEngineService {
    public formGroup: FormGroup;
    public field: string;
    public zipCode = new Subject();
    public templates: object = {};
    public index: number;
    public current_field: string;

    constructor(
        private apiService: ApiService,
        private fb: FormBuilder,
    ) { }



    /**
     * Function to load template data
     * @param id
     *
     * @author Vishnu bk <vishnu.bk@pitsolutions.com>
    */
    public getTemplateData(id): Observable<any> {
        const route = '/inqstemplate/' + id;
        return this.apiService.get(route);
    }

    /**
     * Function remvoe items from local storage
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    public removeItemsFromLocalStorage(): void {
        localStorage.removeItem('cloning');
        localStorage.removeItem('uniqueId');
    }

    /**
     * Function to format data for rendering dymanic form elements
     * @param response: data from template api
     * @returns :formatted data
     *
     * @author Vishnu bk <vishnu.bk@pitsolutions.com>
     */
    public returnForm(response): FormGroup {
        if (!response) {
            return;
        }
        const fieldData = !!response.data ? response.data.template_fields : {};
        const templateFields: Array<Array<any>> = Object.entries(fieldData);
        return this._makeForm(templateFields);

    }

    /**
     * This function will dynamically create the form groups with fromArrays and form groups from give data
     * @param data
     *
     * @author Vijayn PP<vijayan.pp@pitsolutions.com>
     */
    private _makeForm(data: Array<Array<any>>): FormGroup {
        if (!data) {
            return null;
        }

        const formBuilder: FormBuilder = new FormBuilder();
        const newForm: FormGroup = formBuilder.group({});

        data.forEach((item) => {
            if (!Array.isArray(item[1]['fields'])) {
                const control = new FormControl({ value: item[1]['field_value'], disabled: item[1]['fields']['field_disabled'] });
                newForm.addControl(item[0], control);
            } else {
                item[1]['fields'].forEach((k, i) => {

                    this._renderFormArrayFields(item[1]['fields'][i]['fields'], formBuilder, newForm, item);
                });
            }

        });

        return newForm;
    }



    /*
     * This function will create the form arrays from th edata
     * @param data
     *
     * @author Vijayn PP<vijayan.pp@pitsolutions.com>
    */
    private _renderFormArrayFields(data: Object, formBuilder: FormBuilder, newForm: any, item: Object): void {

        const formsArrayField = Object.entries(data);
        const newFormArrayGroup = formBuilder.group({});
        formsArrayField.forEach((items, i) => {
            if ((items[1]['fields'] === undefined)) {
                const control = new FormControl({ value: items[1]['field_value'], disabled: items[1]['field_disabled'] });
                newFormArrayGroup.addControl(items[0], control);
            } else {
                this._renderFormArrayFields(items[1]['fields'], formBuilder, newFormArrayGroup, items);

            }
        });
        if (!newForm.controls[item[0]]) {
            newForm.addControl(item[0], formBuilder.array([newFormArrayGroup]));
        } else {
            newForm.controls[item[0]].push(newFormArrayGroup);
        }
    }

    /**
     * This function will format the data for Form rendering
     * @param data
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    public makeFormData(datatochange: Array<Array<any>>): Array<Object> {
        if (!datatochange) {
            return null;
        }
        let data = JSON.parse(JSON.stringify(datatochange));
        data = Object.entries(data);
        const formRenderData: Array<Object> = data.map((item, index) => {
            if (!Array.isArray(item[1]['fields'])) {
                if (!!item[1]['field_name'] && !!item[1]['fields']) {
                    // tslint:disable-next-line:max-line-length
                    const obj: Object = { column_number: item[1]['column_number'], row_number: item[1]['row_number'], formArray: { name: item[0], cloneOptions: item[1]['clone_options'], isClone: item[1]['is_clone'], data: this.makeFormData(item[1]['fields']) } };
                    return obj;
                } else if (!!item[1]['fields']) {
                    return this._addAditionalData(item[1]);
                } else {
                    return item[1];
                }
            } else {
                const e = item[1]['fields'].map((ite, v) => {

                    this._patchFormTitle(item[1], v, ite);
                    // tslint:disable-next-line:max-line-length
                    const obj: Object = { column_number: item[1]['column_number'], row_number: item[1]['row_number'], formArray: { name: item[0], cloneOptions: item[1]['clone_options'], isClone: item[1]['is_clone'], data: this.makeFormData(item[1]['fields'][v]['fields']) } };

                    if (item[1]['fields'][0]['field_flags']) {
                        obj['formArray']['has_flags'] = true;
                        obj['formArray']['field_flags'] = item[1]['fields'][0]['field_flags'];
                    }
                    return obj;
                });
                return e;
            }
        });


        return formRenderData;
    }
    /**
     * This function will patch title(clone option)
     * @param data
     * @param v
     * @param ite
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     *
     */
    private _patchFormTitle(data, v, ite): void {
        if (!data) {
            return null;
        }
        data['clone_options'].forEach((clite, clindex) => {
            let title;

            const field_name = clite['field_name'];
            const field_title = clite['field_title'];
            const field_value = clite['field_value'];

            if (ite['fields'][field_name]['field_value'] === field_value) {
                title = field_title;

                Object.values(ite['fields'])[1]['field_title'] = title;
                // Object.values(ite['fields'])[0]['field_value'] = field_value;
            }


        });
    }


    /**
     * This function will add addition data to data
     * @param item
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _addAditionalData(item: Object): Object {
        if (!item['field_title']) {
            return null;
        }
        item['fields']['field_title'] = item['field_title'];
        item['fields']['is_clone'] = item['is_clone'];
        item['fields']['is_custom'] = item['is_custom'];
        item['fields']['clone_options'] = item['clone_options'];
        item['fields']['column_number'] = item['column_number'];
        item['fields']['row_number'] = item['row_number'];
        return item['fields'];
    }

    /**
     * This function will patch the json with field value
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     *
     */
    public patchForm(data: object, res: Object): any {
        if (!data || !res) {
            return null;
        }

        const field_values = Object.entries(data);
        field_values.forEach((item, index) => {
            if (!!res[item[0]]) {
                if (!res[item[0]]['fields']['group_fields']) {
                    if (!Array.isArray(item[1])) {
                        res[item[0]]['fields']['field_value'] = item[1];
                    } else {
                        this._patchingInnerFields(item, res);
                    }
                } else {
                    this._groupFieldsValue(res, item[0], res[item[0]]['fields']['group_fields'], data);
                }
            }
        });

        return res;
    }

    private _groupFieldsValue(res: Object, currentField: any, groupfields: Object, data: Object): void {
        if (!res) {
            return null;
        }
        const group_fields = Object.entries(groupfields);
        group_fields.forEach((item) => {
            res[currentField]['fields']['group_fields'][item[0]]['fields']['field_value'] = data[item[0]];
        });

    }

    /**
     * Function to patch the fields with values
     * @param item
     * @param res
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _patchingInnerFields(item, res): void {
        if (!item || !res) {
            return null;
        }

        item[1].forEach((ar1, i) => {

            if (!!res[item[0]]['fields'][0]['fields']) {
                const a = Object.entries(ar1);
                a.forEach((a1, j) => {
                    if (res[item[0]]['fields'][0]['fields'][a1[0]]) {
                        if (!Array.isArray(a1[1])) {
                            if (i === 0) {
                                res[item[0]]['fields'][i]['fields'][a1[0]]['field_value'] = a1[1];
                            } else {
                                if (!res[item[0]]['fields'][i]) {
                                    res[item[0]]['fields'].push({
                                        ...res[item[0]]['fields'][0]
                                    });
                                    const e = JSON.parse(JSON.stringify(res[item[0]]['fields'][i]['fields']));
                                    res[item[0]]['fields'][i]['fields'] = {
                                        ...e
                                    };
                                }
                                res[item[0]]['fields'][i]['fields'][a1[0]]['field_value'] = a1[1];
                            }
                        } else {
                            a1[1].forEach((l, x) => {
                                const h = Object.entries(l);
                                h.forEach((h1, z) => {
                                    if (!!res[item[0]]['fields'][i] && !!res[item[0]]['fields'][i]['fields'][a1[0]]['fields'][h1[0]]) {
                                        res[item[0]]['fields'][i]['fields'][a1[0]]['fields'][h1[0]]['field_value'] = h1[1];
                                    }
                                });
                            });
                        }
                    } else {
                        if (!isNaN(a1[1])) {
                            res[item[0]]['fields'][i]['block_id'] = a1[1];
                        }
                    }
                });

            }
        });
    }


    /**
     * This function will convert form data to desired format
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     *
     */
    public converFormDataForSaving(data: object, res: Object): any {
        if (!data || !res) {
            return null;
        }

        let copy = JSON.parse(JSON.stringify(data));
        copy = this.formatData(data, res);
        return copy;
    }

    /**
     * Function to format the data
     * @param data
     * @param res
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    public formatData(data: Object, res: Object): Object {
        if (!data || !res) {
            return null;
        }

        const dataCopy = JSON.parse(JSON.stringify(data));
        for (const key in dataCopy) {
            if (key) {
                if (!Array.isArray(dataCopy[key]) || dataCopy[key][0]['text']) {
                    if (res[key] && !Array.isArray(res[key]['fields'])) {
                        if (!!dataCopy[key] && !!dataCopy[key]['formatted']) {
                            dataCopy[key] = dataCopy[key]['formatted'];
                        }
                        dataCopy[key] = {
                            ...res[key],
                            fields: {
                                ...res[key]['fields'],
                                field_value: (Array.isArray(dataCopy[key])) ? parseInt(dataCopy[key][0]['id'], 10) : dataCopy[key]
                            }
                        };
                    }
                } else {
                    this._createJsonStructure(dataCopy, res, data, key);
                }
            }
        }

        return dataCopy;
    }

    /**
     * This function will create the JSON STRUCTURE
     * @param data
     * @param res
     * @param key
     *
     * @author Vijayan PP<vijayan.pp@pitsolution.com>
    */
    private _createJsonStructure(dataCopy: Object, res: Object, data: Object, key: any): void {
        if (!dataCopy) {
            return null;
        }

        data[key].forEach((item, index) => {
            const g = Object.entries(item);
            g.forEach((p, i) => {
                if (index === 0) {
                    this.field = p[0];
                    dataCopy[key] = {
                        ...res[key],
                        fields: [
                            {
                                ...res[key]['fields'][0],
                                fields: {

                                }
                            }
                        ]
                    };
                    const f = res[key]['fields'][0]['fields'];
                    dataCopy[key]['fields'][index]['fields'] = {
                        ...f
                    };
                } else {
                    this.field = p[0].split('-')[0];
                    if (i === 0) {
                        if (res[key]['fields'][index]) {
                            dataCopy[key]['fields'].push({
                                ...res[key]['fields'][index],
                                fields: {

                                }
                            });
                        } else {
                            dataCopy[key]['fields'].push({
                                ...res[key]['fields'][0],
                                block_id: 0,
                                fields: {

                                }
                            });
                        }
                    }
                    const e = JSON.parse(JSON.stringify(res[key]['fields'][0]['fields']));
                    if (!dataCopy[key]['fields'][index]['fields'][this.field]) {
                        dataCopy[key]['fields'][index]['fields'] = {
                            ...e
                        };
                    }

                }
                if (!Array.isArray(p[1]) || p[1][0]['text']) {
                    if (res[key]['fields'][0]['fields'][this.field]) {
                        // tslint:disable-next-line:max-line-length
                        dataCopy[key]['fields'][index]['fields'][this.field]['field_value'] = (Array.isArray(p[1])) ? parseInt(p[1][0]['id'], 10) : !!p[1] && typeof p[1] === 'object' ? p[1]['text'] : p[1];

                    }
                } else {
                    p[1].forEach((it, ind) => {
                        const c = Object.entries(it);
                        c.forEach((b, v) => {
                            // tslint:disable-next-line:max-line-length
                            dataCopy[key]['fields'][index]['fields'][this.field]['fields'][b[0]]['field_value'] = (Array.isArray(b[1])) ? parseInt(b[1][0]['id'], 10) : !!b[1] && typeof b[1] === 'object' ? b[1]['text'] : b[1];
                        });

                    });
                }
            });

        });
    }


    /**
     * Function to change the zip code
     *
     *
     * @param value
     * @param formGroup
     * @param index
    */
    public changeZipCode(value: string, formGroup: FormGroup, index): void {
        if (!value || !formGroup) {
            return null;
        }
        this.index = index;
        this.formGroup = formGroup;
        this.zipCode.next(value);
    }
}

