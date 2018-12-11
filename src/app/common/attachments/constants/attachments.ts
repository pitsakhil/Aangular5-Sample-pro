export const ATTACHMENT_STATUS = {
    1: 'Valid',
    2: 'Invalid',
    3: 'Draft',
    4: 'Mixed'
};

export const ATTACHMENT_SYSTEM_STATUS = {
    1: 'Upload Error',
    2: 'Old Revision'
};

export class IconTypes {
    public static CREATE = 'create';
    public static ADD = 'add';
    public static EDIT = 'edit';
    public static DELETE = 'delete';
    public static DOWNLOAD = 'download';
    public static CLOSE = 'close';
    public static EXTENSION_VALID = 'extension_valid';
    public static UPDATE = 'update';
}

export class ClickActions {
    public static ADD = 'add';
    public static DELETE = 'delete';
    public static UPDATE = 'update';
    public static DOWNLOAD = 'download';
    public static EXTENSION_CONFIRM = 'extension_confirm';
    public static MAIN_ADD = 'save';
    public static MAIN_UPDATE = 'edit';
}

export class API_ACTIONS {
    public static ADD = 'add';
    public static EDIT = 'edit';
}

export class AttachmentUrls {
    public static DOWNLOAD_ATTACHMENTS = '/scayla-files/{sf_id}/attachments/{attachment_ids}/download';
    public static ATTACHMENTS_MAIN_URL = '/scayla-files/{sf_id}/attachments';
    public static PUBLIC_CATEGORY = '/companies/categories';
    public static PRIVATE_CATEGORY = '/usersettings/categories';
    public static DOWNLOAD_API = '/attachments/upload';
    public static FORCE_DOWNLOAD = '/download?filename={file_name}';
}
