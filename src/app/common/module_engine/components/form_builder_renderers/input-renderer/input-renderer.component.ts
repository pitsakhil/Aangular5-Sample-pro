import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { Field } from '../../../models/field.interface';
import { FieldConfig } from '../../../models/field-config.interface';
import { ModuleEngineService } from '../../../services/module-engine.service';
import { GoogleMapsService } from 'google-maps-angular2';
import { AfterViewInit } from '@angular/core/';
import { HelperService } from '../../../../../core/services';
import { FormControl } from '@angular/forms/src/model';

@Component({
    selector: 'app-input-renderer',
    templateUrl: './input-renderer.component.html',
    styleUrls: ['./input-renderer.component.scss']
})

export class InputRendererComponent implements Field, AfterViewInit {
    public config: FieldConfig;
    public group: FormGroup;
    public copy: FieldConfig;
    public zipcode: string;
    public geocoder;
    public map;
    public formindex: number;

    @ViewChild('mapElement') mapElement: ElementRef;

    constructor(
        public moduleEngineService: ModuleEngineService,
        private helperService: HelperService
    ) { }

    ngAfterViewInit() {
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
            if (config.field_validation['is_phone']) {
                validatorArray.push(this.helperService.validatePhoneNumber);
            }
            if (config.field_validation['is_url']) {
                validatorArray.push(this.helperService.validateUrl);
            }
            if (config.field_validation['is_alpha']) {
                validatorArray.push(this.helperService.validateAlphabets);
            }
            if (config.field_validation['is_email']) {
                validatorArray.push(this.helperService.validateEmail);
            }
            if (config.field_validation['field_required']) {
                validatorArray.push(Validators.required);
            }
            if (config.field_validation['maxlength']) {
                validatorArray.push(Validators.maxLength(config.field_validation['maxlength']));
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
     * This function will handle the cloning in input control
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _manageCloning() {
        this.copy = JSON.parse(JSON.stringify(this.config));
        const cloneTitle = localStorage.getItem('cloning');
        localStorage.removeItem('cloning');
        const field_value = this.group.controls[this.copy.field_name].value;
        const fieldControl = this.group.controls[this.copy.field_name];
        if (cloneTitle) {
            if (this.copy['field_title']) {
                this.copy['field_title'] = cloneTitle;
            }
        }
        !this.copy.field_value ?
            fieldControl.patchValue(field_value) :
            this._patchFormValue(this.copy, this.group);
        this._setValidators(this.copy, this.group);
    }



}
