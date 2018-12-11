import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/field-config.interface';
import { FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../../../core/services';

@Component({
    selector: 'app-mobile-phone',
    templateUrl: './mobile-phone.component.html',
    styleUrls: ['./mobile-phone.component.scss']
})
export class MobilePhoneComponent implements OnInit {
    public config: FieldConfig;
    public group: FormGroup;
    public copy: FieldConfig;
    public formindex: number;
    public group_fields: Array<object>;

    constructor(private helperService: HelperService) { }

    ngOnInit() {
        this._init();
    }

    private _init() {
        this._manageCloning();
    }



    /**
     * This function will handle the cloning in email control
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _manageCloning(): void {
        this.copy = JSON.parse(JSON.stringify(this.config));
        this.group_fields = Object.entries(this.copy['group_fields']);
        const cloneTitle = localStorage.getItem('cloning');
        localStorage.removeItem('cloning');
        if (cloneTitle) {
            if (this.copy['field_title']) {
                this.copy['field_title'] = cloneTitle;
            }
        }
    }

}
