import { Action } from '@ngrx/store';

import { Spinner } from './../../models/spinner';
import { SpinnerActions } from './spinner.action';

export function SpinnerReducer(
    spinner: Spinner = { spinnerState: true },
    action: any// Action
): Spinner {
    switch (action.type) {
        case SpinnerActions.UPDATE_SPINNER_STATE:
            return Object.assign({}, spinner, { spinnerState: action.payload });
        default:
            return spinner;
    }
}
