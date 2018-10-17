import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/field-config.interface';
import { FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../../../core/services';


@Component({
    selector: 'app-hidden',
    templateUrl: './hidden.component.html',
    styleUrls: ['./hidden.component.scss']
})
export class HiddenComponent implements OnInit {

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
        (group.controls[config['index']]) ? group.controls[config['index']].patchValue(config.field_value) : group.controls[config['field_name']].patchValue(config.field_value);
    }

    /**
     * This function will handle the cloning in hidden control
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _manageCloning(): void {
        this.copy = JSON.parse(JSON.stringify(this.config));
        const cloneTitle = localStorage.getItem('cloning');

        if (cloneTitle) {
            if (this.copy['field_title']) {
                this.copy['field_title'] = cloneTitle;
            }
            if (localStorage.getItem('clonedfield')) {
                this.copy['field_value'] = localStorage.getItem('clonedfield');
                //   localStorage.removeItem('clonedfield');
            }
        }
        this._patchFormValue(this.copy, this.group);
    }






}
