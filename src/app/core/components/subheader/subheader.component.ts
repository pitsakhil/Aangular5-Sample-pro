import { Component, OnInit } from '@angular/core';
import { InquisivDashboardRouting } from '../../constants/app-routing';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-subheader',
    templateUrl: './subheader.component.html',
    styleUrls: ['./subheader.component.scss']
})
export class SubheaderComponent implements OnInit {

    constructor() { }

    ngOnInit() { }

    public navigateToDashboard() {
        window.location.assign(InquisivDashboardRouting.DASHBOARD + environment.DOMAIN_NAME);
    }
}
