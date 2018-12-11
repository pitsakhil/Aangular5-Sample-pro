import {
    CompanylogoComponent,
    SearchComponent,
    SubheaderComponent,
    SpinnerComponent
} from './components';

import {
    AuthService,
    AuthGuard,
    ModuleGuard
} from './auth';

import {
    ApiService,
    ApiInterceptorService,
    HelperService,
    SharedStorageService,
    ToggleService,
    CoreService,
    DevmodeLoginService
} from './services';


import {
    ProjectActions
} from './../modules/projects/store/';

import { SpinnerActions, CoreModuleActions } from './store';

export const coreComponents = [
    CompanylogoComponent,
    SearchComponent,
    SubheaderComponent,
    SpinnerComponent
];

export const authServices = [
    AuthService,
    AuthGuard,
    ModuleGuard
];

export const coreServices = [
    ApiService,
    ApiInterceptorService,
    HelperService,
    SharedStorageService,
    ToggleService,
    CoreService,
    DevmodeLoginService
];

export const actionServices = [
    ProjectActions,
    SpinnerActions,
    CoreModuleActions
];


