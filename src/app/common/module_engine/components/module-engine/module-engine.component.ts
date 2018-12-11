import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

import { FieldConfig } from '../../models/field-config.interface';
import { ModuleEngineService } from '../../services/module-engine.service';

@Component({
    exportAs: 'moduleEngine',
    selector: 'app-module-engine',
    templateUrl: './module-engine.component.html',
    styleUrls: ['./module-engine.component.scss']
})

export class ModuleEngineComponent implements OnInit, OnChanges {
    @ViewChild('submit') submit1: ElementRef;
    @Input() config: Object;
    @Input() form: FormGroup;
    @Output() submit: EventEmitter<any> = new EventEmitter<any>();

    public rows;
    get valid() { return this.form.valid; }
    get value() { return this.form.value; }
    constructor(private moduleEngineService: ModuleEngineService) { }

    ngOnInit() {
        this._init();
        this.getHeadingData(this.config);
    }
    ngOnChanges() {
        if (this.form) {
            return this.form.valid;
        }
    }

    private _init(): void {
        this.moduleEngineService.removeItemsFromLocalStorage();
        // tslint:disable-next-line:max-line-length

    }



    public getHeadingData(config): void {
        if (config) {
            const total_rows = config.layout.length;
            const rows = [];

            for (let i = 1; i <= total_rows; i++) {
                const array = config.data.filter((res) => {
                    if (Array.isArray(res)) {
                        return res[0].row_number === i;
                    } else {
                        return res.row_number === i;
                    }
                });
                const formGroups = [];
                for (let j = 1; j <= config.layout[i - 1]['columns']; j++) {
                    formGroups.push(array.filter((res) => {
                        if (Array.isArray(res)) {
                            return res[0].column_number === j;
                        } else {
                            return res.column_number === j;
                        }
                    })
                    );
                }
                rows.push(formGroups);
            }


            this.rows = rows;
        }
    }

    public handleSubmit(event: Event) {
        if (event) {
            this.submit.emit(event);
        } else {
            return null;
        }
    }
}

