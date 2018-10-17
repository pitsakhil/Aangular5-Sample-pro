import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProjectActions } from '../../../store';
import { ToggleService } from '../../../../../core/services/index';
import { } from '@angular/core/src/event_emitter';

@Component({
    selector: 'app-project-treeview',
    templateUrl: './project-treeview.component.html',
    styleUrls: ['./project-treeview.component.scss']
})
export class ProjectTreeviewComponent implements OnInit {
    @Output() public openEditMode = new EventEmitter<boolean>();

    constructor(
        private _projectActions: ProjectActions,
        private _toggleService: ToggleService

    ) { }

    ngOnInit() {
        this._init();
    }

    /**
     * this function will invoke all the functions
     *
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _init(): void {
        this._projectActions.fetchTreeViewData({ moduleId: 1 });
        const lang = localStorage.getItem('lang');
    }

    public triggerEditMode() {



    }
}
