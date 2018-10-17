import { Action } from '@ngrx/store';

export function createAction(type, payload?): any/*Action*/ {
    return { type, payload };
}
