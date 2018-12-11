import { Component, OnDestroy } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-aggrid-header',
    templateUrl: './aggrid-header.component.html',
    styleUrls: ['./aggrid-header.component.scss']
})
export class AggridHeaderComponent implements IHeaderAngularComp, OnDestroy {
    public params: any;

    constructor() { }

    agInit(params: any): void {
        this.params = params;
        this.params.displayName = !!params.displayName ? params.displayName : params.data.key;
    }

    /**
     * Called once, before the instance is destroyed.
     *
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     */
    ngOnDestroy() {
        this.params = null;
    }

}
