import { Injectable, isDevMode } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../auth';
import { JwtHelper } from 'angular2-jwt';
import { Subscription } from 'rxjs/Subscription';
import { HelperService } from './helper.service';
import { ApiService } from './api.service';



@Injectable()
export class DevmodeLoginService {
  private subscription = new Subscription();
  private credentials = { username: 'sreekanth.mn@pitsolutions.com', password: this._helperService.encodeToBase64('Pass@123'), lang: 'en_US' };

  constructor(public translate: TranslateService,
    private _helperService: HelperService,
    private _authService: AuthService,
    private _apiService: ApiService,
    private jwtHelper: JwtHelper) { }


  /**
   * Function to login automatically on devlopment mode
   *
   * @author Vishnu BK<vishnu.bk@ptisolutions.com>
   */
  public devModeLogin(): boolean {
    const domainName = window.location.hostname.substring(window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) + 1);
    if (isDevMode() || domainName === 'localhost') {
      if (!localStorage.getItem('LOCAL_TOKEN_KEY') || !this._authService.isAuthenticated()) {
        const logindata = this.credentials;
        this.subscription = this._apiService.post('/auth/login', logindata, true).subscribe({
          next: (res) => {
            if (!!res.data.token) {
              this.setLocalStorage(res);
              window.location.reload();
            }
          }, error: (err: any) => {
            if (err.status) {
              console.log(err);
            }
            throw err;
          }
        });
      }
      return true;
    } else {
      return false;
    }
  }

  /**
 * Function to set local storage on login
 *
 * @author Vishnu BK<vishnu.bk@ptisolutions.com>
 */
  private setLocalStorage(res): void {

    localStorage.setItem('LOCAL_TOKEN_KEY', JSON.stringify({
      token: res.data.token
    }));
    const userdata = this.jwtHelper.decodeToken(res.data.token);
    localStorage.setItem('USER_DATA', JSON.stringify(userdata.payload));
    localStorage.setItem('USER_DEFAULT_COMPANY_ID', JSON.stringify(userdata.payload['defaultCompanyId']));
    localStorage.setItem('lang', userdata.payload.defaultUserCompanyLanguage);
  }
}
