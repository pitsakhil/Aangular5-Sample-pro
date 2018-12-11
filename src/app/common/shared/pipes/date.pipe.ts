import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { log } from 'util';
import { Observable } from 'rxjs/Observable';

@Pipe({
    name: 'datepipe'
})
export class ScaylaDatePipe implements PipeTransform {

    transform(value: Date, allDays: any): any {
        return this.setdateTime(value, allDays);
    }

    constructor(public translate: TranslateService) {
    }

    // source: http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
    getWeekNumber(d: Date): number {
        // Copy date so don't modify original
        d = new Date(+d);
        d.setHours(0, 0, 0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        // Get first day of year
        const yearStart = new Date(d.getFullYear(), 0, 1);
        // Calculate full weeks to nearest Thursday
        const weekNo = Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
        // Return array of year and week number
        return weekNo;
    }

    private setdateTime(d: Date, all: any): any {
        const today = new Date();
        const weekno = this.getWeekNumber(today);
        const dd = ('0' + today.getDate()).slice(-2);
        const ddd = today.getDay();
        const mm = ('0' + (today.getMonth() + 1)).slice(-2);
        const dayArray = new Array('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
        const yy = today.getFullYear();
        const h = ('0' + today.getHours()).slice(-2);
        const m = ('0' + today.getMinutes()).slice(-2);
        const day = all[dayArray[ddd - 1]];
        const date = weekno + ' ' + day + '. ' + dd + '.' + mm + '.' + yy + ' ' + h + ':' + m;
        return date;
    }
}
