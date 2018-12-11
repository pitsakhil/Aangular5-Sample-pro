import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthServiceMock {

    constructor() { }

    /**
     * Function return dummy company id
     */
    public getCompanyId(): string {
        return '0';
    }

}
