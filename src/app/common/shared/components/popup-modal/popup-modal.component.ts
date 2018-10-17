import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-popup-modal',
    templateUrl: './popup-modal.component.html',
    styleUrls: ['./popup-modal.component.scss']
})
export class PopupModalComponent {
    @Input('title') title: string;
    @Input('buttonName') buttonName: string;
    @Output() confirm = new EventEmitter();
    public isClicked: Boolean;
    constructor() { }

    /**
     * Function emit value false on cancel click
     */
    cancel() {
        this.confirm.emit(false);
    }

    /**
     * Function emit value true on ok click
     */
    confirmed() {
        if (this.isClicked) {
            return false;
        }
        this.isClicked = true;
        this.confirm.emit(true);
        const timeout = setTimeout(() => {
            this.isClicked = false;
            clearTimeout(timeout);
        }, 500);
    }

}
