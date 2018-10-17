import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../../models/field.interface';
import { FieldConfig } from '../../../models/field-config.interface';

@Component({
  selector: 'app-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss']
})

export class ButtonRendererComponent implements Field {
  public config: FieldConfig;
  public group: FormGroup;
  public formindex: number;
}
