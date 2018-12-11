import { Action } from '@ngrx/store';

export function createAction(type, payload?): any {
    return { type, payload };
}
