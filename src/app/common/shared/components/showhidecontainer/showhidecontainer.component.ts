import { Component, OnInit, ContentChild } from '@angular/core';

@Component({
    selector: 'app-showhidecontainer',
    templateUrl: './showhidecontainer.component.html',
    styleUrls: ['./showhidecontainer.component.scss']
})
export class ShowhidecontainerComponent implements OnInit {


    public showButton = false;
    public showPassword = false;

    @ContentChild('showhideinput') input;

    constructor() { }

    ngOnInit() {
        this.showButtonOrNot();
    }

    /**
     * Function to show or hide pasword field
     */
    public toggleShow(): void {
        this.showPassword = !this.showPassword;
        if (this.showPassword) {
            this.input.nativeElement.type = 'text';
        } else {
            this.input.nativeElement.type = 'password';
        }
    }

    /**
     * Function to show or hide 'show/hide' button
     */
    public showButtonOrNot(): void {
        const self = this;
        this.input.nativeElement.addEventListener('keyup', function () {
            const inputValue = self.input.nativeElement.value;
            if (inputValue.length > 0) {
                self.showButton = true;
            } else {
                self.showButton = false;
                self.showPassword = false;
                self.input.nativeElement.type = 'password';
            }
        }
        );
    }
}
