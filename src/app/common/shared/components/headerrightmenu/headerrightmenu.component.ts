import { Component, OnInit } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { InquisivDashboardRouting, RoutingPaths } from '../../../../core/constants/app-routing';


@Component({
    selector: 'app-headerrightmenu',
    templateUrl: './headerrightmenu.component.html',
    styleUrls: ['./headerrightmenu.component.scss']
})
export class HeaderrightmenuComponent implements OnInit {

    constructor() { }

    ngOnInit() { }

    public navigateToDashboard(): void {
        window.location.assign(InquisivDashboardRouting.DASHBOARD + environment.DOMAIN_NAME + RoutingPaths.DASHBOARD);
    }

}
