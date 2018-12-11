import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { skip } from 'rxjs/operators';
import { ProjectService } from '../../../services/index';
import { ToggleService } from '../../../../../core/services/index';
@Component({
    selector: 'app-project-document-list',
    templateUrl: './project-document-list.component.html',
    styleUrls: ['./project-document-list.component.scss']
})
export class ProjectDocumentListComponent implements OnInit {
    public subscriptions = new Subscription();
    public showGrid = false;



    constructor(private _projectService: ProjectService, private _toggleService: ToggleService) { }

    ngOnInit() {
        this._init();


    }
    private _init() {
        this._showGrid();
        this._triggerDetailViewWhenDoubleClick('detailView')

    }

    private _showGrid(): void {
        this._projectService.getDateTime().subscribe({
            next: (res) => {
                if (res['timeDiff']) {
                    this.showGrid = true;
                }
            }
        });

    }

    private _triggerDetailViewWhenDoubleClick(param: string): void {
        if (!param) {
            return;
        }
        if (localStorage.getItem(param)) {
            this._toggleService.setGridStatus('rightbar', true, 5);
            this._toggleService.setGridActiveOrNot('maincontent', true);
        }
    }



}
