import { ComponentFactoryResolver, ComponentRef, ViewContainerRef, Directive, Input, OnChanges, OnInit, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from './../models/field.interface';
import { FieldConfig } from './../models/field-config.interface';
import {
    ButtonRendererComponent,
    InputRendererComponent,
    SelectRendererComponent,
    TinyEditorComponent,
    FileRendererComponent,
    DateRendererComponent,
    EmailRendererComponent,
    AutoCompleteRendererComponent,
    LabelRendererComponent,
    Ng2SelectRendererComponent,
    LabelInputRendererComponent,
    HiddenComponent,
    PersonalProfileComponent,
    CompanyProfileComponent,
    MobilePhoneComponent
} from '../components';

const components: { [type: string]: Type<Field> } = {
    button: ButtonRendererComponent,
    textfield: InputRendererComponent,
    selectbox: SelectRendererComponent,
    html_editor: TinyEditorComponent,
    file: FileRendererComponent,
    date: DateRendererComponent,
    email: EmailRendererComponent,
    autocomplete: AutoCompleteRendererComponent,
    label: LabelRendererComponent,
    ng2selectbox: Ng2SelectRendererComponent,
    labeltextfield: LabelInputRendererComponent,
    personalprofile: PersonalProfileComponent,
    companyprofile: CompanyProfileComponent,
    hidden: HiddenComponent,
    cluster: MobilePhoneComponent
};

@Directive({
    selector: '[appDynamicFields]'
})
export class DynamicFieldsDirective implements Field, OnChanges, OnInit {
    @Input() config: FieldConfig;
    @Input() group: FormGroup;
    @Input() formindex: number;

    component: ComponentRef<Field>;

    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef
    ) { }

    ngOnInit() {
        this._init();
    }

    ngOnChanges() {
        this._change();
    }

    /**
     * init all the functions
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
    */
    private _init(): void {
        this._initFormRenderComponents();
    }

    /**
     * change functions
     *
     * @author Vishnu BK<vishnu.bk@pitsolutions.com>
    */
    private _change(): void {
        if (this.component) {
            this.component.instance.config = this.config;
            this.component.instance.group = this.group;
            this.component.instance.formindex = this.formindex;
        }
    }

    /**
     * Function to render form components
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */

    private _initFormRenderComponents(): void {

        let elementType;
        // tslint:disable-next-line:forin
        for (const key in components) {

            if (key === this.config.field_type) {
                elementType = this.config.field_type;
            }
        }
        if (!!elementType) {
            const component = this.resolver.resolveComponentFactory<Field>(components[elementType]);
            this.component = this.container.createComponent(component);
            this.component.instance.config = this.config;
            this.component.instance.group = this.group;
            this.component.instance.formindex = this.formindex;
        } else if (!this.config.field_type) {
        }

    }



}



