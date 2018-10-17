import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from './../../../environments/environment';

@Injectable()
export class ApiService {

    constructor(private http: HttpClient) { }

    /**@author Vijayan PP <vijayan.pp@pitsolutions.com>
     * Function to seda data to the server
     * @param url-API URL
     * @param body-Payload
     */
    post(url: string, body: Object, api_type?): Observable<any> {
        const API_URL = (!api_type) ? environment.API_URL : environment.API_AUTH_URL;
        return this.http.post(API_URL + url, body).map((res: Response) => res);
    }

    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     * Function to fetch data from the server
     * @param url
     */
    get(url: string, api_type?): Observable<any> {
        const API_URL = (!api_type) ? environment.API_URL : environment.API_AUTH_URL;
        return this.http.get(API_URL + url).map((res: Response) => res);
    }

    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     * Function to update the data
     * @param url-API URL
     * @param body-Payload
     */
    put(url: string, body: Object, api_type?): Observable<any> {
        const API_URL = (!api_type) ? environment.API_URL : environment.API_AUTH_URL;
        return this.http.put(API_URL + url, body).map((res: Response) => res);
    }

    /**
     * @author Vijayan PP <vijayan.pp@pitsolutions.com>
     * Function to remove the data
     * @param url: API URL with ID
     */
    delete(url: string, api_type?): Observable<any> {
        const API_URL = (!api_type) ? environment.API_URL : environment.API_AUTH_URL;
        return this.http.delete(API_URL + url).map((res: Response) => res);
    }
}
