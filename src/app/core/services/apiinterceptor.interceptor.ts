import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthService } from '../auth';
import { ApiService } from './api.service';
import { error } from 'util';
import { SpinnerActions } from '../../core/store/';
import { GeneralUrls } from '../constants/config';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
import { NotificationService } from '../../common/notification/services/notification.service';
import { environment } from '../../../environments/environment';


@Injectable()
export class ApiInterceptorService {
    public tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public requestUrls: Array<string> = [];

    constructor(
        public auth: AuthService,
        private injector: Injector,
        private notificationService: NotificationService,
        private spinnerActions: SpinnerActions,
    ) { }

    /**
     * Function to intercept all the HTTP/2 calls
     * 
     * 
     * @param request: HTTP/2 request
     * @param next: HTTP Handler
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.requestUrls.push(request['url']);
        this.spinnerActions.updateStorage(true);
        request = this.cloneHeader(request);
        return this.handleRequest(request, next);
    }

    /**
     * Function helps to clone header to request and return the request
     * @param requset : called api request
     */
    cloneHeader(request: HttpRequest<any>): HttpRequest<any> {
        if (request.url.split('/attachments/upload')[0] === environment.API_UPLOAD_URL) {
            return request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${this.auth.getToken()}`,
                    'Accept-Language': `${this.auth.getLanguage()}`,
                }
            });
        }
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${this.auth.getToken()}`,
                'Accept-Language': `${this.auth.getLanguage()}`,
                'Content-Type': 'application/json'
            }
        });
    }




    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     * Function to get refresh token from the server
     */
    public refreshToken() {
        const api = this.injector.get(ApiService);
        return api.post(GeneralUrls.REGENERATE_TOKEN, { lang: localStorage.getItem('lang') }, 'auth');
    }


    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     *
     * Function to handle the HTTP2 response
     * @param request: HTTP/2 request
     * @param next:  HTTP Handler
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     */
    handleRequest(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) { // do stuff with response if you want
                // setTimeout(() => { this.spinnerActions.updateStorage(false); }, 500);
            }

        }).catch((err) => {
            if (err instanceof HttpErrorResponse) {
                // setTimeout(() => { this.spinnerActions.updateStorage(false); }, 500);
                switch ((<HttpErrorResponse>err).status) {
                    case 449:
                        return this.handle401Error(request, next);
                    case 401:
                        return this.handle401Error(request, next);
                    case 409:
                        this.handle409Error(err);
                        break;
                    case 404:
                        this.handle404Error(err);
                        break;
                    default:
                        return Observable.throw(err);
                }
            } else {

                return Observable.throw(error);
            }
        }).finally(() => {
            this.requestUrls = this.requestUrls.filter(item => item !== request.url);
            // tslint:disable-next-line:no-unused-expression
            (this.requestUrls.length === 0) && this.spinnerActions.updateStorage(false);
        })

    }


    /**
    * Function to handle the 401 error Response
    * @param req
    * @param next
    * @author Vijayan PP <vijayan.pp@pitsolutions.com>
    */
    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const currentUser = this.auth.isAuthenticated();

        this.tokenSubject.next(null);
        return this.refreshToken()
            .switchMap((res) => {
                if (res.data.token) {
                    this.storeTokenToStorage(res.data.token);
                    this.tokenSubject.next(res.data.token);
                    const request = this.cloneHeader(req);
                    return this.handleRequest(request, next);
                }
                // this.auth.logOut();
            }, (err: any) => {
                this.auth.logOut();
            });

    }

    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     * 
     * Function to handle the 409 error response
     * @param err 
     */
    private handle409Error(err): void {
        if (err) {
            localStorage.setItem('lang', err.error.data.lang);
        } else {
            localStorage.setItem('lang', 'en_US');
        }
    }

    private handle404Error(err): void {
        this.notificationService.error('error', err.error.message);
    }

    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     * 
     * Function to store token to local Storage
     * @param token--token
     */
    private storeTokenToStorage(token): void {
        if (!!token) {
            localStorage.removeItem('LOCAL_TOKEN_KEY');
            localStorage.setItem('LOCAL_TOKEN_KEY', JSON.stringify({
                token: token
            }));
        } else {
            return null;
        }
    }

}
