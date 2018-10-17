import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { Field } from '../../../models/field.interface';
import { FieldConfig } from '../../../models/field-config.interface';
import { ModuleEngineService } from '../../../services/module-engine.service';
import { HelperService } from '../../../../../core/services';


@Component({
    selector: 'app-select-renderer',
    templateUrl: './select-renderer.component.html',
    styleUrls: ['./select-renderer.component.scss'],
})
export class SelectRendererComponent implements Field, OnInit {
    public config: FieldConfig;
    public group: FormGroup;
    public copy: FieldConfig;
    public formindex: number;
    public toggle: Boolean;

    constructor(public moduleEngineService: ModuleEngineService, private helperService: HelperService) {
    }

    ngOnInit() {
        this._manageCloning();
    }


    /**
     * Change event in ng select
     *
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    */
    onChange(event) {
        // tslint:disable-next-line:no-unused-expression
        (this.group) && this.group.controls[this.copy.field_name].patchValue(event);
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
            if (config.field_validation['is_email']) {
                validatorArray.push(this.helperService.validateEmail);
            }
            if (config.field_validation['is_multiple_email']) {
                validatorArray.push(this.helperService.validateMultipleEmail);
            }
            if (config.field_validation['field_required']) {
                validatorArray.push(Validators.required);
            }
            group.controls[$controlName].setValidators(validatorArray);
        }

    }

    getCurrentModule() {
        return localStorage.getItem('currentModule');
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
            this.copy['field_title'] = cloneTitle;
        }
        this._setValidators(this.copy, this.group);
    }

    /**
     * @author Akhil K<akhil.kn@pitsolutions.com>
     *
     * Function works when toggle icon click
     *
     * @param fields
     */
    toggleAction(fields: Array<string>) {
        this.toggle = !this.toggle;
        fields.forEach((field) => {
            const toggleElement = Array.from(document.querySelectorAll(`[toggle-id=${field}]`))[0];
            (!!this.toggle) ?
                toggleElement.classList.add('toggle-on') :
                toggleElement.classList.remove('toggle-on');
        });
    }

}
