import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/field-config.interface';
import { FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../../../core/services';

@Component({
    selector: 'app-company-profile',
    templateUrl: './company-profile.component.html',
    styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {

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
     * This function will handle the cloning in email control
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _manageCloning(): void {
        this.copy = JSON.parse(JSON.stringify(this.config));


        this.copy = this.copy['group_fields'];
    }

}
