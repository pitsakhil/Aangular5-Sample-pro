import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/field-config.interface';
import { FormGroup } from '@angular/forms';


@Component({
    selector: 'app-label-renderer',
    templateUrl: './label-renderer.component.html',
    styleUrls: ['./label-renderer.component.scss']
})
export class LabelRendererComponent implements OnInit {
    public config: FieldConfig;
    public group: FormGroup;
    public formindex: number;
    constructor() { }

    ngOnInit() {
        this._onListen(this.config);
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
     * @author Akhil K <akhil.kn@ptsolutions.com>
     *
     * Function works when field_data key exist
     *
     * @param config
     */
    private _onListen(config: FieldConfig): void {
        if ('field_data' in config) {
            const onListen = config['field_data']['onListen'];
            const returnData = onListen['field_logic'];
            this.group.controls[`${onListen['field_group']}`].valueChanges.subscribe((res) => {
                this.group.controls[`${config['field_name']}`].patchValue('');
                const paramsArray = [];
                res.forEach(data => {
                    paramsArray.push(onListen['params_data_fields'].map(field => !!data[`${field}`] && typeof data[`${field}`] === 'object' ? data[`${field}`]['text'] : data[`${field}`]));
                });
                paramsArray.forEach((params) => {
                    const callFunction = new Function('a', `return ${returnData}`);
                    const result = callFunction([...params]);
                    if (!!result) {
                        return this.group.controls[`${config['field_name']}`].patchValue(result);
                    }
                });
            });
        }
    }
}
