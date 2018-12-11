import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { Permission, UserToken, CanComponentDeactivate } from '../models/permission.model';

import { DashboardUrls } from '../../core/constants/config';
import { environment } from '../../../environments/environment';
import { InquisivDashboardRouting } from '../constants/app-routing';

@Injectable()
export class AuthGuard implements CanActivate, CanDeactivate<CanComponentDeactivate> {
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
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        this.currentUser = this.auth.getToken();

        let tokenValid: Boolean = false;
        if (this.currentUser) {
            tokenValid = this.auth.isAuthenticated();
        }
        if (!!this.currentUser && tokenValid) {
            return this.permissions.canActivate(this.currentUser);
        } else if (!!this.currentUser && !tokenValid) {
            this.auth.logOut();
            return false;
        } else {
            window.location.assign(InquisivDashboardRouting.LOGIN + environment.DOMAIN_NAME);
            return false;
        }
    }



    /**
     * service to deactivate the Component
     *
     * @param component
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    canDeactivate(component: CanComponentDeactivate) {
        this.currentUser = this.auth.getToken();
        return component.canDeactivate ? component.canDeactivate() : this.permissions.canDeactivate(this.currentUser);
    }

}

