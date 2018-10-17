/**
 *  @author Vijayan PP <vijayan.pp@pitsolutions.com>
 *
 */


export class InquisiveConfiguration {
    public static NOTIFICATION_OPTIONS = {
        timeOut: 5000,
        lastOnBottom: true,
        clickToClose: false,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'bottom'],
        iconColor: ''
    };
}

export class ContactUrls {
    public static CONTACT = '/contact';
    public static CONTACT_LIST = '/contacts';
    public static CONTACT_DETAIL = '/contacts/';
    public static CONTACT_LISTS = 'contact/list/';
    public static SAVE_METADATA = '/scayla-files/{id}/metadata';
}
export class MetadataUrls {
    public static METADATA = '/scayla-files/{id}/metadata';
    public static STATUS = '/list?source=status';
    public static PRIORITY = '/list?source=priority';
    public static USERS = '/node/{folderId}/members?access=Edit&module_id=';
    public static TEMPLATE = '/inqstemplate/10';
    public static MODULES = '/modules';
    public static DELEGATE_TO = '/node/';
    public static DOCUMENT_PERMISSION = '/list?source=sf_permissions';
    public static PROJECTS = '/projects';
}

export class HistoryUrls {
    public static HISTORY = '/scayla-files/{sf_id}/history';
}

export class QuickNoteUrls {
    public static QUICKNOTE = '/scayla-files/{sf_id}/quick-notes';
}

export class DashboardUrls {
    public static DASHBOARD = '/dashboard';
}


export class EmailUrls {
    public static EMAIL_FOLDER = '/email/folders';
    public static EMAIL = '/email';
    public static EMAIL_DETAIL = '/email/';
    public static EMAIL_SAVE = '/email/save';
}

export class DocumentUrls {
    public static DOCUMENT_LIST = '/scayla-files';
    public static MODULE_LIST = '/modules';
}

export class ProjectUrls {
    public static PROJECT_LIST = '/projects';
    public static PROJECT_STRUCTURE = '/projects/structure';
    public static MODULE_LIST = '/modules';
}

export class GeneralUrls {
    public static REGENERATE_TOKEN = '/auth/regenerate_token';
    public static SALUTATION = '/list?source=salutation';
    public static ACTION_LIST = '/list?source=actions';
}

export class GeneralSettingsUrls {
    public static COMPANY = '/companies';
    public static COMPANY_USERS = '/companies/users/';
    public static NODE = '/node';
    public static LIST_NODE = '/node/company/';
    public static USER_MAPPING = '/node/{id}/members/map';
    public static USER_UNMAPPING = '/node/{id}/members/unmap';
    public static MAPPED_USERS = '/node/{id}/members';
    public static EMAIL_IMPORT_ACCOUNT_UPDATE = '/email/account/';

}

export class SystemsettingsUrls {
    public static SYSTEM_SETTINGS_LANGUAGE = '/systemsettings/languages';
    public static MAP_UNMAP_LANGUAGES = '/systemsettings/languages/';
    public static MAPPED_LANGUAGES = '/systemsettings/languages';
    public static UNMAP_DATE_TIME = '/systemsettings/datetime/unmap';
    public static MAP_DATE_TIME = '/systemsettings/datetime/map';
    public static LIST_DATE_TIME_FORMATS = '/systemsettings/datetime';
    public static STATE = '/systemsettings/locations/state';
    public static ZIPCODE = '/systemsettings/locations/zipcodes';
    public static LOCATIONS = '/systemsettings/locations';
    public static COUNTRIES = '/systemsettings/countries';
    public static TIMEZONES = '/systemsettings/timezones';
    public static MAP_COUNTRY = '/systemsettings/countries/map';
    public static UNMAP_COUNTRY = '/systemsettings/countries/unmap';
    public static MAP_TIMEZONES = '/systemsettings/timezones/map';
    public static UNMAP_TIMEZONES = '/systemsettings/timezones/unmap';
}


export class UserSettingsUrls {
    public static USER_PROFILE_UPDATE = '/users/';
    public static NORMAL_USER_PROFILE_UPDATE = '/usersettings/company/profile';
    public static USER_PROFILE_UPDATE_NORMAL_USER = '/usersettings/company/profile';
    public static GLOBAL_PROFILE_UPDATE = '/auth/system/profile';
    public static AUTH_USER_SETTINGS_DETAILS = '/auth/account/';
    public static RESET_PASSWORD = '/auth/reset_password_profile';
    public static GENERAL_DATA = '/list';
    public static UPDATE_USER_CALENDAR_SETTINGS = '/usersettings/calendar';
    public static GET_GLOBAL_PROFILE = 'auth/system/profile';
}

export class EmailImportUrls {
    public static CONNECTION_TYPES = '/email/account/connection_types';
    public static AUTHENTICATION_TYPES = '/email/account/authentication_types';
    public static DELETE_INTERVALS = '/email/account/delete_intervals';
    public static EMAIL_NODE_LIST = '/node/2';
    public static ADD_EMAIL_ACCOUNT = '/email/account';
    public static EMAIL_ACCOUNT_LIST = '/email/account';
}

export class UserManagementUrls {
    public static COMPANY_USER_LIST = '/users';
    public static ADD_COMPANY_USER = '/users';
}

export class CalendarUrls {
    public static CALENDAR_EVENT = '/calendar/';
    public static CALENDAR_LIST = '/calendar';
    public static CALENDAR_EVENTS = '/calendar';
}
export class UserGroupUrls {
    public static UNMAPPED_GROUPS = '/usergroups/search';
    public static USER_GROUPS = '/usergroups';
    public static USER_GROUP_LIST = '/companies/usergroups';
    public static UNMAP_USER = '/users/unmap';
    public static MAP_USER = '/companies/usergroups/{id}/users/map';
    public static UNMAPPED_GROUPS_TO_NODE = '/node/{id}/groups/search'
}

export class PermissionsConst {
    public static READ = 1;
    public static EDIT = 2;
    public static DELETE = 3;
    public static ADD = 4;
    public static ZERO = 0;
    public static ONE = 1;
    public static TWO = 2;
    public static THREE = 3;
    public static FOUR = 4;
    public static READVALUE = 1;
    public static EDITVALUE = 2;
    public static DELETEVALUE = 4;
    public static ADDVALUE = 8;
}

export class AuthUrls {
    public static logout = '/auth/logout';
}


export class ErrorResponse {
    public static OK = 200;
    public static NOT_FOUND = 404;
    public static METHOD_NOT_FOUND = 405;
    public static INTERNAL_SERVER_ERROR = 500;
}
export class ModuleUrls {
    public static List = { 'contacts': 1, 'mail': 2, 'calendar': 3, 'documents': 4, 'projects': 5 };
}

export class CategoryUrls {
    public static ADD_PUBLIC_CATEGORY = '/companies/categories';
    public static PUBLIC_CATEGORY_LIST = '/companies/categories/tree';
    public static PUBLIC_CATEGORY_DETAIL = '/companies/categories/';
    public static IS_CATEGORY_DELETABLE = '/companies/categories/checkstatus/';
    public static ADD_PRIVATE_CATEGORY = '/usersettings/categories';
    public static PRIVATE_CATEGORY_LIST = '/usersettings/categories/tree';
    public static PRIVATE_CATEGORY_DETAIL = '/usersettings/categories/';
    public static GET_LIST_CATEGORY_LIST_PARENT = '/companies/categories/parent';
    public static GET_LIST_CATEGORY_LIST_PARENT_PRIVATE = '/usersettings/categories/parent';
    public static PUBLIC_CATEGORY_URL = '/settings/category_public';
    public static PRIVATE_CATEGORY_URL = '/settings/category_private';
}
