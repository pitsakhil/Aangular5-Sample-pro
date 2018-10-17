import { Component, OnInit } from '@angular/core';
import { SharedStorageService } from '../../services/shared-storage.service';
import { SpinnerActions } from '../../store/index';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
    public spinnerState = true;
    constructor(private sharedStorageService: SharedStorageService, private spinnerActions: SpinnerActions) { }

    ngOnInit() {
        this.showOrHideSpinner();
    }
    /**
     * @author Akhil Kn<akhil.kn@pitsolutions.com>
     * Function to show or hide spinner state
     */
    showOrHideSpinner() {
        this.spinnerState = true;
        this.sharedStorageService.getSpinnerState().subscribe((res) => {
            this.spinnerState = res.spinnerState;
        });
    }

}
