import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { HelperService, ApiService, SharedStorageService } from './core/services';
import { AuthService } from './core/auth';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { NotificationService } from './common/notification/services/notification.service';
import { AttachmentsService } from './common/attachments/services';
import { Keepalive } from '@ng-idle/keepalive';
import { Subscription } from 'rxjs/Subscription';
import { CoreModuleActions } from './core/store';
import { ToggleService } from './core/services';
import { DevmodeLoginService } from './core/services/devmode-login.service';
import { CookieService } from '../../node_modules/ngx-cookie';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    public isOverLay: boolean;
    constructor(
        public translate: TranslateService,
        public toggleService: ToggleService,
        public attachmentsService: AttachmentsService,
        private _helperService: HelperService,
        private _authService: AuthService,
        private coreModuleActions: CoreModuleActions,
        private _idle: Idle,
        private _apiService: ApiService,
        private devModeLoginService: DevmodeLoginService,
        private cookieService: CookieService,
        private _sharedStorageService: SharedStorageService,
    ) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en_US');
        // tslint:disable-next-line:no-unused-expression
        this._helperService.languageChange();
        if (!localStorage.getItem('isChecked')) { this._browserIdleInit(); }
    }

    /**
     * Called after the constructor and called  after the first ngOnChanges()
     */
    ngOnInit() {
        this._init();
        this._getSpinnerState();
    }

    private _init() {
        const devMode = this.devModeLoginService.devModeLogin();
        // tslint:disable-next-line:no-unused-expression
        (!devMode && this.setLocalStorageFromCookie());
        this._fetchUserData();
    }

    private _getSpinnerState(): void {
        this._sharedStorageService.getSpinnerState().subscribe(res => {
            if (!!res) {
                this.isOverLay = res.spinnerState;
            }
        });
    }
    /**
* Function to set local storage from cookie
* 
* @author Vishnu BK<vishnu.bk@ptisolutions.com>
*/
    private setLocalStorageFromCookie(): void {
        if (this.cookieService.get('LOCAL_TOKEN_KEY')) {
            localStorage.setItem('lang', this.cookieService.get('lang'));
            localStorage.setItem('LOCAL_TOKEN_KEY', this.cookieService.get('LOCAL_TOKEN_KEY'));
            localStorage.setItem('USER_DATA', this.cookieService.get('USER_DATA'));
            localStorage.setItem('USER_DEFAULT_COMPANY_ID', this.cookieService.get('USER_DEFAULT_COMPANY_ID'));
            this.cookieService.get('isChecked') === 'true' ? localStorage.setItem('isChecked', this.cookieService.get('isChecked')) : localStorage.removeItem('isChecked');
        }
    }

    /**
     * Function to log out after browser idle for a long.
     * 
     * @author Vishnu C A <vishnu.ca@ptisolutions.com>
     */
    private _browserIdleInit(): void {
        this._idle.setIdle(1);
        this._idle.setTimeout(1800);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the Project
        this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this._idle.onTimeout.subscribe(() => {
            // tslint:disable-next-line:no-unused-expression
            (this._idle.getTimeout() === 1800) && this._authService.logOut();


        });
        this.reset();
    }

    /**
     * Function to fetch User Data from the server
     * @author Vijayan PP <vijayan.pp@pitsolution.com>
     */

    private _fetchUserData(): void {
        this.subscription.add(this._apiService.get('/auth/system/profile', true).subscribe(res => {
            const token_payload = JSON.parse(localStorage.getItem('USER_DATA'));
            localStorage.setItem('timezone', res['data']['timezone_name']);
            // tslint:disable-next-line:no-unused-expression
            localStorage.setItem('DEFAULT_CONTACT_ID', token_payload.defaultUserCompanyContactId);
            localStorage.setItem('timezone', res['data']['timezone_name']);
            this.coreModuleActions.fetchTimezoneDateFormat();

        }));
    }


    private _loadMenuDatasAccordingToUserRights(): void {


    }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to hide overlay
     */
    public hideOverlay(): void {
        const overlayGrids = ['navbaroverlay', 'rightbaroverlay'];
        overlayGrids.forEach((grid) => {
            if (this.toggleService.checkGridActive(`${grid}`)) {
                this.toggleService.toggle(`${grid}`);
            }
        });
    }
    public hideUserInfo(event) {
        // tslint:disable-next-line:curly
        if (event.target.closest('#userInfo-toggle')) return;
        const isClosest = !!event.target.closest('#mainDrop') || !!event.target.closest('#dropDownMenu');
        this.toggleService.onToggleUserIcon(true, isClosest);
    }
    /**
     * Function to reset the Browser idle time
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     */
    reset() {
        this._idle.watch();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
