import { Injectable, isDevMode } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from './api.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AuthUrls } from '../constants/config';
import { CookieService, CookieOptions } from '../../../../node_modules/ngx-cookie';
import { InquisivDashboardRouting } from '../constants/app-routing';
import { environment } from '../../../environments/environment';

@Injectable()
export class HelperService {
    private subscriptions: Subscription[] = [];
    public cookieOption: CookieOptions;
    constructor(
        public translate: TranslateService,
        private apiService: ApiService,
        private authService: AuthService,
        private router: Router,
        private cookieService: CookieService) { }

    /**
     * Function to change language in tranlate
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    public languageChange() {
        const domainName = window.location.hostname.substring(window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) + 1);
        let lang = '';
        if (isDevMode() || domainName === 'localhost') {
            lang = !!localStorage.getItem('lang') ? localStorage.getItem('lang') : (navigator.language).replace('-', '_');
        } else {
            lang = !!this.cookieService.get('lang') ? this.cookieService.get('lang') : (navigator.language).replace('-', '_');
        }
        localStorage.setItem('lang', lang);
        this.translate.use(lang);
    }

    /**
    *Function to navigate the location to the provided url

    * @param url:URL to navigate;

    @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    naviagateTo(url: string) {
        this.router.navigateByUrl(url);
    }

    /**
       * Function for the base64 encoding
       *
       * @param string
       *
       * @author Vijayan PP <vijayan.pp@pitsolutions.com>
       */
    encodeToBase64(string: string): string {
        if (!!string) {
            return window.btoa(string);
        } else {
            return null;
        }
    }

    /**
     * Function for the base64 decoding
     *
     * @param string
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    decodeToBase64(string: string): string {

        if (!!string) {
            return window.atob(string);
        } else {
            return null;
        }
    }

    logoutApiFunction() {
        const domainName = window.location.hostname.substring(window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) - 1) + 1);
        const date = new Date();
        this.cookieOption = { path: '/', domain: domainName, expires: JSON.stringify(date.getDate() - 1) };
        this.apiService.post(AuthUrls.logout, {}, 'auth')
            .subscribe((res) => {
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
            }, (err: any) => {
                this.cookieService.put('LOCAL_TOKEN_KEY', null, this.cookieOption);
                localStorage.clear();
                window.location.assign(InquisivDashboardRouting.LOGIN + environment.DOMAIN_NAME);
            });
    }

    /**
       * Function to check the state of a checkebox:checked or not in an event(like click,change etc)
       *
       * @param e :Event
       *
       * @author Vijayan PP <vijayan.pp@pitsolutions.com>
       */

    checkBoxCheckedOrNot(e) {
        if (!!e.target.checked) {
            return true;
        } else {
            return false;
        }
    }

    /**
       * Function to Get the checkbox status-checked or not
       *
       * @param id :Id to pass
       *
       * @author Vijayan PP <vijayan.pp@pitsolutions.com>
       */

    getCheckBoxValue(id) {
        const input = <HTMLInputElement>document.getElementById(id);
        if (input.checked) {
            return true;
        } else {
            return false;
        }
    }

    /**
       * This function will validate the email
       *
       * @param control -form control
       * @return null if email is correct;
       *
       * @author Vijayan PP <vijayan.pp@pitsolutions.com>
       */
    validateEmail(control): { [s: string]: boolean } {
        // tslint:disable-next-line:max-line-length
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!!control.value) {
            if (!pattern.test(control.value)) {
                return { email: true };
            } else {
                return null;
            }
        }
    }

    /**
        * This function will validate the email
        *
        * @param control -form control
        * @return null if email is correct;
        *
        * @author Vishnu BK <vishnu.bk@pitsolutions.com>
        */
    validateMultipleEmail(control) {
        // tslint:disable-next-line:max-line-length
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!!control.value) {
            let flag = true;
            control.value.forEach(element => {
                if (!pattern.test(element['id'])) {
                    flag = false;
                }
            });
            return !flag ? { email: true } : null;
        }
    }


    /**
     * Function to validate date format
     *
     * @param control -formcontrol
     * @return null if dete is correct;
     *
     * @author Vishnu.Bk <vishnu.bk@pitsolutions.com>
     */
    validateDate(control): { [s: string]: boolean } {
        const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/[0-9]{4}$/;
        if (!!control.value) {
            if (!pattern.test(control.value)) {
                return { date: true };
            } else {
                return null;
            }
        }
    }

    /**
     * Function to validate zipcode
     *
     * @param control -formcontrol
     * @return null if zipcode is correct;
     *
     * @author Vishnu.Bk <vishnu.bk@pitsolutions.com>
     */
    validateZipcode(control): { [s: string]: boolean } {
        const pattern = /^(?=.*[A-Za-z0-9])[A-Za-z0-9-\s]{2,8}$/;
        const value = !!control.value && typeof control.value === 'object' ? control.value['text'] : control.value;
        if (!!value) {
            if (!pattern.test(value)) {
                return { zipcode: true };
            } else {
                return null;
            }
        }
        return null;
    }

    /**
    * Function to validate zipcode
    *
    * @param control -formcontrol
    * @return null if phonenumber is correct;
    *
    * @author Vishnu.Bk <vishnu.bk@pitsolutions.com>
    */
    validatePhoneNumber(control): { [s: string]: boolean } {
        const pattern = /^[0-9]+( [0-9]+)*$/;
        if (!!control.value) {
            if (!pattern.test(control.value)) {
                return { phone: true };
            } else {
                return null;
            }
        }
    }

    /**
    * Function to validate url
    *
    * @param control -formcontrol
    * @return null if url is correct;
    *
    * @author Vishnu.Bk <vishnu.bk@pitsolutions.com>
    */
    validateUrl(control): { [s: string]: boolean } {
        const pattern = /(?:(?:http|https):\/\/)?([-a-zA-Z0-9.]{2,256}\.[a-z]{2,4})\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&=]*)?/;
        if (!!control.value) {
            if (!pattern.test(control.value)) {
                return { url: true };
            } else {
                return null;
            }
        }
    }


    /**
    * Function to validate url
    *
    * @param control -formcontrol
    * @return null if url is correct;
    *
    * @author Vishnu.Bk <vishnu.bk@pitsolutions.com>
    */
    validateAlphabets(control): { [s: string]: boolean } {
        const pattern = /^([^0-9]*)$/;
        if (!!control.value) {
            if (!pattern.test(control.value)) {
                return { alpha: true };
            } else {
                return null;
            }
        }
    }

    /**
     * Function to remove token from the storage
     *
     * @param token;
     *
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */

    removeTokenFromLocalStorage(token) {
        if (localStorage.getItem(token)) {
            localStorage.removeItem(token);
        }
    }
}
