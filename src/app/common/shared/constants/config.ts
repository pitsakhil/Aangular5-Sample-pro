export const TIMEFORMAT = {
    hhmmA: 'hh:mm A',
    HHmm: 'HH:mm',
    timeType: 'AM/PM'
};

export const ExceptionKeys = [
    'salutation',
    'title',
    'status',
    'priority',
    'language',
    'address_country',
    'company_country',
    'address_state',
    'company_state'
];

export class MetadataUrls {
    public static METADATA = '/scayla-files/{id}/metadata';
}

export class HandoverUrls {
    public static HANDOVER = '/scayla-files/{id}/handover';
    public static HANDOVER_HISTORY = '/scayla-files/{id}/handover/history';
}
export const MODULES = {
    CONTACTS: 1,
    EMAIL: 2,
    CALNEDAR: 3,
    DOCUMENTS: 4,
    PROJECTS: 5
};
