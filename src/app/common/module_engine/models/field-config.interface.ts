import { ValidatorFn } from '@angular/forms';

export interface FieldConfig {
    field_value?: string;
    field_title?: string;
    field_validation?: ValidatorFn[];
    field_position?: {};
    field_disabled?: boolean;
    field_name?: any;
    options?: Array<any>[];
    field_placeholder?: string;
    field_type?: string;
    is_toggle?: boolean;
    is_toggle_field?: boolean;
    value?: any;
    fields?: any;
    disabled?: boolean;
    label?: any;
    index?: any;
    is_location?: boolean;
}
