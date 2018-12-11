import { Action } from '@ngrx/store';
import { GlobalProfileActions } from './global.profile.action';
import { GlobalProfile } from '../../models/quicknotes.model';


const INITIAL_STATE = {
    userdata: {}
};
export function GlobalProfileReducer(
    globalProfile: GlobalProfile = INITIAL_STATE,
    action: any
): GlobalProfile {
    switch (action.type) {
        case GlobalProfileActions.UPDATE_GLOBAL_PROFILE_DETAILS:
            return Object.assign({}, globalProfile, { userdata: action.payload });
        case GlobalProfileActions.RESET_GLOBAL_PROFILE_DETAILS:
            return Object.assign({}, globalProfile, { userdata: [] });
        default:
            return globalProfile;
    }
}
