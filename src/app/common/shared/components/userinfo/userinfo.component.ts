import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { CookieService, CookieOptions } from 'ngx-cookie';
import { AuthService } from '../../../../core/auth';
import { CoreModuleActions } from '../../../../core/store';
import { ApiService, HelperService, SharedStorageService, ApiInterceptorService, ToggleService } from '../../../../core/services';
import { GeneralUrls } from '../../../../core/constants/config';
import { InquisivDashboardRouting, RoutingPaths } from '../../../../core/constants/app-routing';
import { environment } from '../../../../../environments/environment';
declare var window;

@Component({
    selector: 'app-userinfo',
    templateUrl: './userinfo.component.html',
    styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent implements OnInit, AfterViewInit {
    public user_details: any;
    jwtHelper: JwtHelper = new JwtHelper();
    public userData: String;
    public companyData: any;
    public today = new Date();
    public allVal;
    public dateTime = {};
    public cookieOption: CookieOptions;


    constructor(public translate: TranslateService,
        public authService: AuthService,
        public _helperService: HelperService,
        private _apiService: ApiService,
        private sharedStorageService: SharedStorageService,
        private _coreModuleActions: CoreModuleActions,
        private _apiInterceptorService: ApiInterceptorService,
        private router: Router,
        private cookieService: CookieService,
        public toggleService: ToggleService
    ) {
        this.translate.get('datepipe.weekname')
            .subscribe((data) => {
                this.allVal = data;
            });
    }

    ngOnInit() {
        this.init();
    }

    /**
     * Function to invoke the functions
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */
    private init(): void {
        this._fetchTimezone();
        this._fetchUserData();
    }

    /**
    * function returns to fetch timezone and date format from store.
    *
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    */
    private _fetchTimezone() {
        this.sharedStorageService.getTimezoneDate().subscribe({
            next: (res) => {
                if (!!res.timezone.timezone && !!res.dateformat.dateformat) {
                    res.timezone.timezone.forEach(element => {
                        // tslint:disable-next-line:no-unused-expression
                        if (element.default === '1') {
                            localStorage.setItem('timeDiff', element.time_diff.replace(':', ''));
                            this.dateTime['timeDiff'] = element.time_diff.replace(':', '');
                        }
                    });
                    res.dateformat.dateformat.forEach(element => {
                        if (element.default === '1' && element.format_type_id === 1) {
                            localStorage.setItem('dateformat', element.format);
                            this.dateTime['dateFormat'] = element.format;
                        }
                        if (element.default === '1' && element.format_type_id === 2) {
                            localStorage.setItem('timeformat', element.format);
                            this.dateTime['timeFormat'] = element.format;
                        }
                    });
                    localStorage.setItem('dateTime', JSON.stringify(this.dateTime));
                }
            }, error: (err) => {
                throw err;
            }
        });
    }

    /**
     * Function loaded after view loaded
     *
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    */
    ngAfterViewInit() {
        this._changeAfterSwitch();
    }
    private _changeAfterSwitch(): void {
        this.user_details = JSON.parse(localStorage.getItem('USER_DATA'));
        this.companyData = this.user_details.accounts[0].companies;
        this.userData = this.getUserName(this.user_details);
    }
    /**
     * Function to get username
     * @param user_details : logged in user details.
     *
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */
    public getUserName(user_details) {
        if (user_details) {
            let userName = user_details.firstName + ' ' + user_details.lastName;
            userName = userName.length < 20 ? userName.substring(0, 19) : `${userName.substring(0, 16)}...`;
            return userName;
        } else {
            return '';
        }
    }

    /**
    * Function trigger when acount switches
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    *
    * @param value : selected company id
    */
    private accountSwitch(value): void {
        localStorage.setItem('USER_DEFAULT_COMPANY_ID', JSON.stringify(value));
        this._apiInterceptorService.tokenSubject.next(null);
        this._apiService.post(`${GeneralUrls.REGENERATE_TOKEN}?default_company_id=${value}`, { lang: localStorage.getItem('lang') }, 'auth')
            .subscribe((res) => {
                if (res.data.token) {
                    this.storeTokenToStorage(res.data.token);
                    this._apiInterceptorService.tokenSubject.next(res.data.token);
                    return null;
                }
            }, (err: any) => {
            });

    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to store token to local Storage
     * @param token--token
     */
    private storeTokenToStorage(token): void {
        if (!!token) {
            const token_payload = this.jwtHelper.decodeToken(token).payload;
            localStorage.setItem('LOCAL_TOKEN_KEY', JSON.stringify({
                token: token
            }));
            localStorage.setItem('USER_DATA', JSON.stringify(token_payload));
            localStorage.setItem('USER_DEFAULT_COMPANY_ID', JSON.stringify(token_payload.defaultCompanyId));
            localStorage.setItem('lang', token_payload.defaultUserCompanyLanguage);
            localStorage.setItem('DEFAULT_CONTACT_ID', token_payload.defaultUserCompanyContactId);
            const domainName = window.location.hostname.substring(window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) - 1) + 1);
            this.cookieOption = { path: '/', domain: domainName };
            this.cookieService.put('LOCAL_TOKEN_KEY', JSON.stringify({ token: token }), this.cookieOption);
            this.cookieService.put('USER_DATA', JSON.stringify(token_payload), this.cookieOption);
            this.cookieService.put('USER_DEFAULT_COMPANY_ID', JSON.stringify(token_payload.defaultCompanyId), this.cookieOption);
            this.cookieService.put('lang', token_payload.defaultUserCompanyLanguage, this.cookieOption);
            this._coreModuleActions.fetchNavbarData();
            this._changeAfterSwitch();
            this._helperService.languageChange();
            window.location.assign(InquisivDashboardRouting.DASHBOARD + environment.DOMAIN_NAME + RoutingPaths.DASHBOARD);
        } else {
            return null;
        }
    }

    /**
     * Function to fetch User Data from the server
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */

    private _fetchUserData(): void {
        this.sharedStorageService.getUserAccountDetails().subscribe({
            next: (res) => {
                if (!!res.USER_ACCOUNT_DATA) {
                    const token_payload = this.jwtHelper.decodeToken(res.USER_ACCOUNT_DATA).payload;
                    localStorage.setItem('LOCAL_TOKEN_KEY', JSON.stringify({
                        token: res.USER_ACCOUNT_DATA
                    }));
                    localStorage.setItem('USER_DATA', JSON.stringify(token_payload));
                    localStorage.setItem('USER_DEFAULT_COMPANY_ID', JSON.stringify(token_payload.defaultCompanyId));
                    localStorage.setItem('lang', token_payload.defaultUserCompanyLanguage);
                    localStorage.setItem('DEFAULT_CONTACT_ID', token_payload.defaultUserCompanyContactId);
                    const domainName = window.location.hostname.substring(window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) - 1) + 1);
                    this.cookieOption = { path: '/', domain: domainName };
                    this.cookieService.put('LOCAL_TOKEN_KEY', JSON.stringify({ token: res.USER_ACCOUNT_DATA }), this.cookieOption);
                    this.cookieService.put('USER_DATA', JSON.stringify(token_payload), this.cookieOption);
                    this.cookieService.put('USER_DEFAULT_COMPANY_ID', JSON.stringify(token_payload.defaultCompanyId), this.cookieOption);
                    this.cookieService.put('lang', token_payload.defaultUserCompanyLanguage, this.cookieOption);
                    this.companyData = token_payload.accounts[0].companies;
                }
            }, error: (err) => {
                throw err;
            }
        });
    }
    public onToggleUserIcon() {
        this.toggleService.onToggleUserIcon();
    }

}
