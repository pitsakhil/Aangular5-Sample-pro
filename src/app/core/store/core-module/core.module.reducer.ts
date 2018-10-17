import { Action } from '@ngrx/store';

import { CoreModuleActions } from './core.module.action';
import { TimezoneDate, SourceValueData, ModuleData } from '../../models/core.model';

const INITIAL_STATE = {
    timezone: {},
    dateformat: {},
    language: {},
    userAccountData: {}
};
const INITIAL_SOURCE = {
    sourceValue: {},
    timeformat: {},
    event_remainders: {}
};

const INITIAL_MODULE_DATA = {
    navbarData: [{}]
};
export function CoreModuleReducer(
    timezoneDate: TimezoneDate = INITIAL_STATE,
    action: any
): TimezoneDate {
    switch (action.type) {
        case CoreModuleActions.UPDATE_TIMEZONE:
            return Object.assign({}, timezoneDate, { timezone: action.payload });
        case CoreModuleActions.UPDATE_DATE_FORMAT:
            return Object.assign({}, timezoneDate, { dateformat: action.payload });
        case CoreModuleActions.UPDATE_LANGUAGE:
            return Object.assign({}, timezoneDate, { language: action.payload });
        case CoreModuleActions.UPDATE_USER_ACCOUNT_DATA:
            return Object.assign({}, timezoneDate, { userAccountData: action.payload });
        default:
            return timezoneDate;
    }
}
export function SourceDataReducer(
    sourceValueData: SourceValueData = INITIAL_SOURCE,
    actions: any
): SourceValueData {
    switch (actions.type) {
        case CoreModuleActions.UPDATE_WEEK_DAYS:
            return Object.assign({}, sourceValueData, { sourceValue: actions.payload });
        case CoreModuleActions.UPDATE_TIME_FORMAT:
            return Object.assign({}, sourceValueData, { timeformat: actions.payload });
        case CoreModuleActions.UPDATE_EVENT_REMINDERS:
            return Object.assign({}, sourceValueData, { event_remainders: actions.payload });
        default:
            return sourceValueData;
    }



}

export function ModuleDataReducer(
    moduleData: ModuleData = INITIAL_MODULE_DATA,
    maction: any
): ModuleData {
    switch (maction.type) {
        case CoreModuleActions.UPDATE_MODULE_NAVBAR:

            return Object.assign({}, moduleData, { navbarData: maction.payload });
        case CoreModuleActions.RESET_MODULE_NAVBAR:
            return Object.assign({}, moduleData, { navbarData: [{}] });

        default:
            return moduleData;
    }
}
