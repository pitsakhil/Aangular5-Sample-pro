import { FormGroup } from '@angular/forms';
import { FieldConfig } from './field-config.interface';

export interface Field {
    config: FieldConfig;
    group: FormGroup;
    formindex?: number;
}

export interface Value {
    subjectText?: any;
}
