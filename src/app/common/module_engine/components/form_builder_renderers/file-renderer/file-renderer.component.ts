import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/field-config.interface';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-file-renderer',
    templateUrl: './file-renderer.component.html',
    styleUrls: ['./file-renderer.component.scss']
})
export class FileRendererComponent implements OnInit {
    public config: FieldConfig;
    public copy: FieldConfig;
    public group: FormGroup;
    public formindex: number;
    constructor() { }

    ngOnInit() {
    }

/**
* function to get current module from local storage
*
* @author Vishnu BK<vishnu.bk@pitsolutions.com>
*/
  getCurrentModule() {
    return localStorage.getItem('currentModule');
  }
}
