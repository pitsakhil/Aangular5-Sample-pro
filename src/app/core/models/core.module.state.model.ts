import { TimezoneDate, SourceValueData, ModuleData } from './core.model';
import { Spinner } from './spinner';

export interface CoreModuleState {
    readonly timezoneDate: TimezoneDate;
    readonly spinner: Spinner;
    readonly sourceValueData: SourceValueData;
    readonly moduleData: ModuleData;
}
