import { Component, OnInit, Input , ViewEncapsulation} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-profile-template',
    templateUrl: './profile-template.component.html',
    styleUrls: ['./profile-template.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProfileTemplateComponent implements OnInit {
   
    @Input() public profileData: Object;
    @Input() public formGroup: FormGroup;

    constructor() { }

    ngOnInit() {
    }

}
