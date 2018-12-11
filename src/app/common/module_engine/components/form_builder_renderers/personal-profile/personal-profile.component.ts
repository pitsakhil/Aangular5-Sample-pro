import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/field-config.interface';
import { FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../../../core/services';
@Component({
    selector: 'app-personal-profile',
    templateUrl: './personal-profile.component.html',
    styleUrls: ['./personal-profile.component.scss']
})
export class PersonalProfileComponent implements OnInit {

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

    public getTitle(formValue: object) {
        if (!!formValue) {
            let salutation = '';
            let title = '';
            if (Array.isArray(formValue['salutation'])) {
                salutation = formValue['salutation'][0]['id'] ? formValue['salutation'][0]['text'] : '';
            }
            if (Array.isArray(formValue['title'])) {
                title = formValue['title'][0]['id'] ? formValue['title'][0]['text'] : '';
            }
            return `${salutation}  ${title}`;
        }
    }

}
