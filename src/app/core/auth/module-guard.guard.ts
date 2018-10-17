import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { Permission, UserToken, CanComponentDeactivate } from '../models/permission.model';

import { DashboardUrls, ModuleUrls } from '../../core/constants/config';
import { InquisivDashboardRouting } from '../constants/app-routing';
import { environment } from '../../../environments/environment';



@Injectable()
export class ModuleGuard implements CanActivate, CanDeactivate<CanComponentDeactivate> {
    public settingsPermissions: any;

    constructor(private router: Router,
        private permissions: Permission,
        private currentUser: UserToken,
        private auth: AuthService
    ) { }

    /**
     * Functio nto activate the route
     * @param route
     * @param state
     *
     * @author Niphy Anto<niphy.ao@pitsolutions.com>
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const havePermission = this._checkModulePermission(state.url);
        if (!havePermission) {
            window.location.assign(InquisivDashboardRouting.DASHBOARD + environment.DOMAIN_NAME);
            return false;
        }
        return true;
    }

    /**
    * Function to  check module permission
    * @param url

    *
    * @author Niphy Anto <niphy.anto@pitsolutions.com>
    */
    private _checkModulePermission(url: string): boolean {
        const _url = window.location.hostname.split('.')[0];
        const res = JSON.parse(localStorage.getItem('MODULES'));
        if (!res) {
            return true;
        }
        let isExist = false;
        Object.keys(res).forEach(val => {
            if (+val === ModuleUrls.List[_url]) {
                isExist = true;
            }
        });
        return isExist;
    }
    /**
     * service to deactivate the Component
     *
     * @param component
     *
    * @author Niphy Anto <niphy.anto@pitsolutions.com>
     */
    canDeactivate(component: CanComponentDeactivate) {
        this.currentUser = this.auth.getToken();
        return component.canDeactivate ? component.canDeactivate() : this.permissions.canDeactivate(this.currentUser);
    }
}
