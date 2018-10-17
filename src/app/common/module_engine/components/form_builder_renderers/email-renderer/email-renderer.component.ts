import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/field-config.interface';
import { FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../../../core/services';


@Component({
    selector: 'app-email-renderer',
    templateUrl: './email-renderer.component.html',
    styleUrls: ['./email-renderer.component.scss']
})
export class EmailRendererComponent implements OnInit {
    public config: FieldConfig;
    public group: FormGroup;
    public copy: FieldConfig;
    public formindex: number;
    constructor(private helperService: HelperService) { }

    ngOnInit() {
        this._init();
    }

    private _init() {
        this._manageCloning();
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
            if (config.field_validation['is_email']) {
                validatorArray.push(this.helperService.validateEmail);
            }
            group.controls[$controlName].setValidators(validatorArray);
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
        // tslint:disable-next-line:no-unused-expression
        (group.controls[config['index']]) ? group.controls[config['index']].patchValue(config.field_value) : group.controls[config['field_name']].patchValue(config.field_value);

    }

    /**
     * This function will handle the cloning in email control
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _manageCloning(): void {
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



}
