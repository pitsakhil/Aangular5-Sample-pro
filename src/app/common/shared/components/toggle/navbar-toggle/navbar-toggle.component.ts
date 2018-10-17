import { Component, OnInit, Input } from '@angular/core';
import { ToggleService } from './../../../../../core/services/toggle.service';

@Component({
    selector: 'app-navbar-toggle',
    templateUrl: './navbar-toggle.component.html',
    styleUrls: ['./navbar-toggle.component.scss']
})
export class NavbarToggleComponent implements OnInit {
    @Input() gridType: string;

    constructor(private _toggleService: ToggleService) { }

    ngOnInit() { }

    public toggleGrid(gridType: string): void {
        if (!gridType) {
            return undefined;
        }
        this._toggleService.toggle(gridType);
    }

}

