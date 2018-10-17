
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { SharedStorageService, ToggleService } from '../../../../core/services';
import { CoreModuleActions } from '../../../../core/store';
import { InquisivDashboardRouting, RoutingPaths } from '../../../../core/constants/app-routing';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-headermenu',
    templateUrl: './headermenu.component.html',
    styleUrls: ['./headermenu.component.scss']
})
export class HeadermenuComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();
    public userData: object;
    public moduleList: Array<object> = [];
    public elementRef: any;
    public accordinArrow$ = 'keyboard_arrow_right';
    public baseRoute: any;
    public routingPath: any;
    public env: any;

    @HostListener('document:click', ['$event', '$event.target'])
    onClick($event: any): void { this._toggleListener($event); }
    constructor(
        private router: Router,
        private _sharedStorageService: SharedStorageService,
        private _coreModuleActions: CoreModuleActions,
        public accordionElement: ElementRef,
        public toggleService: ToggleService
    ) {
        this.elementRef = accordionElement;
        this.baseRoute = InquisivDashboardRouting;
        this.routingPath = RoutingPaths;
        this.env = environment;
    }

    ngOnInit() {
        this._init();
    }

    private _init(): void {
        this.userData = JSON.parse(localStorage.getItem('USER_DATA'));
        this._coreModuleActions.fetchNavbarData();
        this._fetchModuleList();
    }

    private _toggleListener($event): void {
        let clickedComponent = $event.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.closedown();
        }
    }

    public toggleDropDown(): void {
        const x = document.getElementById('dropDownMenu');
        if (x.className.indexOf('shown') === -1) {
            x.className += ' shown';
            x.classList.add('display');
            this.toggleService.setOverlayActiveOrNot(true);
        } else {
            x.className = x.className.replace('shown', '');
            x.classList.remove('display');
            this.toggleService.setOverlayActiveOrNot(false);
        }
        const y = document.getElementById('demoAcc');
        if (y.className.indexOf('dp-none') === -1) {
            y.className += 'dp-none';
        }

    }

    public myAccFunc(): void {
        const x = document.getElementById('demoAcc');
        if (x.className.indexOf('dp-none') === -1) {
            x.className += 'dp-none';
            this.accordinArrow$ = 'keyboard_arrow_right';
        } else {
            x.className = x.className.replace('dp-none', '');
            this.accordinArrow$ = 'keyboard_arrow_down';
        }
    }

    public closedown(): void {
        const x = document.getElementById('dropDownMenu');
        x.className = x.className.replace('shown', '');
        x.classList.remove('display');
        this.accordinArrow$ = 'keyboard_arrow_right';
    }
    /**
     * @author Niphy Anto<niphy.ao@pitsolutions.com>
     *
     * Function to fetch module list
    */
    private _fetchModuleList(): void {
        this._sharedStorageService.getDocumentNavigationBarData().subscribe({
            next: (res) => {
                if (!!res['lists']) {
                    this.moduleList.splice(0, this.moduleList.length);
                    this.moduleList = this._populateItems(res['lists']);
                    this.userData = JSON.parse(localStorage.getItem('USER_DATA'));
                }
            }, error: (err) => {
                throw err;
            }
        });
    }

    /**
     * @author Niphy Anto<niphy.ao@pitsolutions.com>
     *
     * Function to populate items
     */
    private _populateItems(res: any): Array<object> {
        if (!!res) {
            const _moduleReferenceList = res.reference.modules;
            localStorage.setItem('MODULES', JSON.stringify(_moduleReferenceList));
            const array: Array<any> = [];
            Object.keys(res).forEach(val => {
                if (!isNaN(+val)) {
                    const data = {
                        id: res[val].module_id,
                        name: _moduleReferenceList[res[val].module_id]
                    };
                    array.push(data);
                }
            });
            return array;
        }
        return;
    }

    /**
     * @author Niphy Anto <niphy.ao@pitsolutions.com>
     *
     * Function to get url and icon
     */
    public formatData(data: object): string {
        if (!!data) {
            const list = { 1: 'contacts', 2: 'mail', 3: 'calendar', 4: 'documents', 5: 'projects' };
            return list[data['id']];
        }
        return null;
    }


    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

}
