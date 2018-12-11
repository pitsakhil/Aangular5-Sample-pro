// tslint:disable-next-line:max-line-length

import { SpinnerReducer, CoreModuleReducer, SourceDataReducer, ModuleDataReducer } from './index';
import { ProjectReducer } from '../../modules/projects/store/index';
import { MetadataReducer, HistoryReducer, HandoveHistoryReducer } from '../../common/shared/store';
import { QuicknoteReducer } from '../../common/shared/store/quicknote.reducer';
import { GlobalProfileReducer } from '../../common/shared/store/user-profile/global.profile.reducer';

export const rootReducer = {
    spinner: SpinnerReducer,
    project: ProjectReducer,
    metadata: MetadataReducer,
    quicknotes: QuicknoteReducer,
    history: HistoryReducer,
    handoverHistory: HandoveHistoryReducer,
    timezoneDate: CoreModuleReducer,
    sourceValueData: SourceDataReducer,
    moduleData: ModuleDataReducer,
    globalProfile: GlobalProfileReducer
};
