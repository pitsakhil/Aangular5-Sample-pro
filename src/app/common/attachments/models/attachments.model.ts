export class Attachments {
    readonly RowDataTransaction: object;
    readonly attachmentsList: Array<object>;
    readonly attachmentsDetails: Array<object>;
    readonly categories: object;
    readonly success_message: object;
}

export class AttachmentsDetailVariables {
    data?: any;
    editModeOn?: Boolean;
    isAdd?: Boolean;
    status_data?: object;
    parent_data?: object;
    title?: string;
    isDisable?: Boolean;
}

export class AttachmentsTreeGrid {
    reference?: object;
    fileNames?: Array<string>;
    deleteIds?: Array<number>;
    editStopped?: boolean;
    beforeNodeData?: any;
    beforeNodeDataValid?: any;
    currentNodeParams?: any;
    sf_id?: string;
    attachments?: Array<object>;
    dummy_id?: number;
    files?: Array<object>;
    icons?: object;
    components?: object;
    aggFuncs?: object;
    frameworkComponents?: object;
    categoryList?: object;
}
