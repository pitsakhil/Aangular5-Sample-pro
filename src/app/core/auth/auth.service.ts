import { Injectable, isDevMode } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { HttpRequest } from '@angular/common/http';
import { CookieOptions, CookieService } from '../../../../node_modules/ngx-cookie';
import { InquisivDashboardRouting } from '../constants/app-routing';
import { environment } from '../../../environments/environment';
@Injectable()
export class AuthService {
    jwtHelper: JwtHelper = new JwtHelper();
    public cachedRequests: Array<HttpRequest<any>> = [];
    public cookieOption: CookieOptions;
    constructor(private cookieService: CookieService) { }

    public isAuthenticated(): boolean {
        // const token = localStorage.getItem('account_verification_token');
        return !this.jwtHelper.isTokenExpired(this.getToken());
        // return true;
        // return tokenNotExpired();
    }

    /**
    * Function to get JWT token from local storage
    */
    public getToken(): string {
        const domainName = window.location.hostname.substring(window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) + 1);
        if (isDevMode() || domainName === 'localhost') {
            if (localStorage.getItem('LOCAL_TOKEN_KEY')) {
                return JSON.parse(localStorage.getItem('LOCAL_TOKEN_KEY')).token;
            }
        } else {
            if (this.cookieService.get('LOCAL_TOKEN_KEY')) {
                return JSON.parse(this.cookieService.get('LOCAL_TOKEN_KEY')).token;
            }
        }
    }

    /**
    * Function to get language from local storage
    *
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    */
    public getLanguage(): string {
        return localStorage.getItem('lang');
    }

    /**
     * Function to get default company id
     *
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */
    public getCompanyId(): string {
        if (localStorage.getItem('USER_DEFAULT_COMPANY_ID')) {
            return JSON.parse(localStorage.getItem('USER_DEFAULT_COMPANY_ID'));
        } else {
            return '0';
        }
    }

    /**
     * Function to get default company id
     *
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     */
    public getUserContactId(): string {
        if (localStorage.getItem('DEFAULT_CONTACT_ID')) {
            return JSON.parse(localStorage.getItem('DEFAULT_CONTACT_ID'));
        } else {
            return '0';
        }
    }

    /**
     * Function to get default user account id
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    public getUserCompanyId(): string {
        if (localStorage.getItem('USER_DATA')) {
            return JSON.parse(localStorage.getItem('USER_DATA'))['userAccountId'];
        } else {
            return '0';
        }
    }

    /**
     * Function to collect the failed HTTP2 Rquest
     * @param request: Failed HTTP2 Rquest
     */
    public collectFailedRequest(request: HttpRequest<any>): void {
        this.cachedRequests.push(request);
    }

    /**
     * Function clear local storage
     *
     * @author Akhil K<akhil.kn@pitsolutions.com>
     */
    logOut() {
        const domainName = window.location.hostname.substring(window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) - 1) + 1);
        const date = new Date();
        this.cookieOption = { path: '/', domain: domainName, expires: JSON.stringify(date.getDate() - 1) };
        if (!!(localStorage.getItem('isChecked'))) {
            this.cookieService.put('LOCAL_TOKEN_KEY', null, this.cookieOption);
            localStorage.clear();
            this.cookieService.removeAll();
        } else {
            this.cookieService.put('LOCAL_TOKEN_KEY', null, this.cookieOption);
            this.cookieService.put('USER_DATA', null, this.cookieOption);
            localStorage.clear();
            this.cookieService.removeAll();
        }
        window.location.assign(InquisivDashboardRouting.LOGIN + environment.DOMAIN_NAME);
    }

    public retryFailedRequests(): void { }

}
