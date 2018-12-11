import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectorRef
} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    FormArray
} from '@angular/forms';
import { ModuleEngineService } from '../../../services/module-engine.service';


@Component({
    selector: 'app-column-layout',
    templateUrl: './column-layout.component.html',
    styleUrls: ['./column-layout.component.scss']
})
export class ColumnLayoutComponent implements OnInit {

    @Input() public formDataGroups: Array<Array<Object>>;
    @Input() public rows: Array<Object>;
    @Input() public formGroup: FormGroup;
    // tslint:disable-next-line:max-line-length
    @Input() public profileData: Object;
    @Output() public submit: EventEmitter<any> = new EventEmitter();

    constructor(private ref: ChangeDetectorRef, public moduleEngineService: ModuleEngineService, ) { }

    ngOnInit() {

    }


    /**
    * function to get current module from local storage
    *
    * @author Vishnu BK<vishnu.bk@pitsolutions.com>
    */
    public getCurrentModule(): any {
        return localStorage.getItem('currentModule');
    }

    /**
     * This function will return the current FormArray
     * @param form
     * @param formarrayname
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    public returnFormArrayGroups(form: FormGroup, formarrayname: string): any {

        if (form) {
            const d = Object.entries(form.controls);
            const e = d[0][0];
            const g = e.split('-');
            if (g.length > 1) {
                return form.controls[formarrayname + '-' + g[1]]['controls'];
            } else {
                return form.controls[formarrayname]['controls'];
            }
        } else {

        }
    }


    /**
   * Function to initialize map
   *
   * @author Vishnu.bk <vishnu.bk@pitsolutions.com>
   */
    public mapTrigger(modal, field, index?: number): void {
        const zipcode = modal.controls[field].controls[`${index}`].controls['company_zipcode'].value;
        const value = typeof zipcode === 'object' ? zipcode['text'] : zipcode;
        this.moduleEngineService.changeZipCode(value, this.formGroup, index);
        this.moduleEngineService.current_field = field;
    }
    /**
     * This function will return current FormGroup in form array
     * @param form
     * @param formarrayname
     * @param i
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    public returnFormArrayCurrentGroup(form: FormGroup, formarrayname: string, i: number, formfield?: Object): any {
        formfield['index'] = i;
        return form.controls[formarrayname]['controls'][i];
    }

    /**
     * This function will add forgrup to FormaArray
     * @param formParentGroup
     * @param group
     * @param formarrayname
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    public addItem(formParentGroup: FormGroup, group: FormGroup, formarrayname: string, field: Object, title: string, value: string, fields: Array<Object>, groupfield): void {
        if (!formParentGroup || !group || !formarrayname || !field || !title) {
            return null;
        }
        const formArray: FormArray = formParentGroup.get(formarrayname) as FormArray;
        const newControls = this._createNewFormControls(group, value);
        localStorage.setItem('cloning', title);
        localStorage.setItem('clonedfield', value);
        groupfield['formArray']['data'].forEach((item) => {
            if (item['field_value']) {
                if (!item['field_validation']['field_required']) {
                    item['field_value'] = '';
                } else {
                    item['field_value'] = value;
                }


            } else {
                if (item['formArray']) {
                    item['formArray']['data'].forEach((it) => {

                        it['field_value'] = '';
                    });
                }

            }

        });

        fields.push(groupfield);

        formArray.push(newControls);
    }

    /**
     * Function to create the new formcontrols when clicking on the clone button
     * @param controls
     * @param uniqueId
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _createNewFormControls(group: any, value, uniqueId?: number): any {
        if (!group) {
            return;
        }
        const cc = group.controls;
        const g = new FormGroup({});
        for (const c in cc) {
            if (cc[c]) {
                if (!cc[c].controls) {
                    const control = new FormControl({ value: '', disabled: false });
                    g.addControl(c, control);
                } else {
                    const formArray = new FormArray([]);
                    cc[c].controls.forEach((item) => {
                        const d = this._createNewFormControls(item, value);
                        formArray.push(d);
                    });
                    g.addControl(c, formArray);
                }
            }
        }
        const e = Object.keys(g.controls);
        g.controls[e[0]].patchValue(value);

        return g;

    }



    /**
     * This function will remove the Formgroup from FormArray
     * @param formParentGroup
     * @param formarrayname
     * @param index
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    public removeItem(formParentGroup: FormGroup, formarrayname: string, index: number, field: Array<Object>): void {
        if (!formParentGroup || !formarrayname || !index) {
            return null;
        }
        const formArray: FormArray = formParentGroup.get(formarrayname) as FormArray;
        // tslint:disable-next-line:no-unused-expression
        index > 0 ? formArray.removeAt(index) : '';
        field.splice(index, 1);
    }

    /**
     * This function will return the state of form (valid or not)
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    get valid(): boolean {
        return this.formGroup.valid;
    }


    /**
     * This function will return the form group value
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    get value() {
        return this.formGroup.value;
    }

    /**
     * This function will handle the submit event
     *
     * @param event
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    public handleSubmit(event: Event): void {
        if (!event) {
            return null;
        }
        event.preventDefault();
        event.stopPropagation();
        this.submit.emit(this.value);
    }

    public selectOne(event, formArrayName, fieldName, index): void {
        Array.from(document.querySelectorAll(`.${formArrayName}_${fieldName}`)).forEach((el) => {
            if (el !== event.target) {
                el['checked'] = false;
                el['value'] = false;
            }
        });
        this.formGroup.controls[`${formArrayName}`]['controls'].forEach((control, i) => {
            if (i !== index) {
                const patch = {};
                patch[`${fieldName}`] = false;
                control.patchValue(patch);
            }
        });
    }

}
