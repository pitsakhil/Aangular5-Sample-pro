import { ToggleService } from './../../core/services/toggle.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { InquisiveConfiguration } from '../../core/constants/config';
import { TSTATE, TVARIABLES } from '../../common/shared/constants/toggle.config';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
    public options: Object = InquisiveConfiguration.NOTIFICATION_OPTIONS;

    constructor(
        public toggleService: ToggleService
    ) { }

    ngOnInit() {
        this.toggleService.initToggleState(TSTATE.projects, TVARIABLES.projects);
        localStorage.setItem('currentModule', 'projects');
        localStorage.removeItem('detailView');

    }

    ngOnDestroy() {
        localStorage.removeItem('currentproject');
    }

    /**
     * fired when a notification created
     * @param event -type of event
     */
    onCreate(event) { }

    /**
     * fired when a notification destroyed
     * @param event -type of event
     *
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */
    onDestroy(event) { }

}
