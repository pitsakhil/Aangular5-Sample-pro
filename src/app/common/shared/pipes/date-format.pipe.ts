import { Pipe, PipeTransform } from '@angular/core';
import { TIMEFORMAT } from '../constants/config';
import * as moment from 'moment-timezone';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

    private _time = JSON.parse(localStorage.getItem('dateTime'));
    private _timezone = localStorage.getItem('timezone');
    private _dateFormat = this._time ? this._time['dateFormat'].toUpperCase() : '';
    private _timeFormat = this._time ? (this._time['timeFormat'] === TIMEFORMAT.timeType ? 'h:mm A' : 'HH:mm') : '';
    private _dateTimeFormat = this._dateFormat + ' ' + this._timeFormat;

    /**
     * This pipe converts timestamp from back end to user defined format considering: time-date format,timezone etc.
     *
     * @param value : timestamp
     *
     * @param type : if type is defined it will return date else return date and time
     *
     * @Author Sreekanth Mohan<sreekanth.mn@pitsolutions.com>
     */
    transform(value: any, type?: string): string {
        if (!!value) {
            return type === undefined || !type ? moment.unix(value).tz(this._timezone).format(this._dateTimeFormat) : (moment.unix(value).tz(this._timezone).format(this._dateFormat));
        }
    }

    /**
     * This pipe converts time in normal format  from back end to user defined format considering: time-date format,timezone etc.
     *
     * @param value : date
     *
     * @param type : if type is defined it will return date else return date and time
     *
     * @Author vishnu.bk <vishnu.bk@pitsolutions.com>
     */
    public dateFormat(value: any): any {
        let date_format = localStorage.getItem('dateformat') || 'mm/dd/yyyy';
        const val = value.indexOf('/') !== -1 ? value.split('/') : value.split('.');
        const format = date_format.indexOf('/') !== -1 ? date_format.split('/') : date_format.split('.');
        const patchOptions = {
            yyyy: val[2],
            mm: val[+!(value.indexOf('/') !== -1)],
            dd: val[+(value.indexOf('/') !== -1)]
        };
        format.forEach((element) => {
            date_format = date_format.replace(element, `${patchOptions[element]}`);
        });
        return date_format;
    }

}

