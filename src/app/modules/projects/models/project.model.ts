export interface Project {
    readonly projectDocumentsData: Array<object>;
    readonly treeViewData: Array<object>;
    readonly currentProjectDetail: object;
    readonly currentProjectId: number;
    readonly currentPage: string;
    readonly dateTime: {};
}

/**
 * @author Vijayan PP <vijayan.pp@pitsolutions.com>
 *
 * Function to set Project folder data
 * @param data
 * @param currentFolderData
 */
export function setProjectDocumentData(data: Project, projectDocumentsData: Array<Object>): Project {
    if (!!data) {
        return Object.assign({}, data, { projectDocumentsData });
    } else {
        return;
    }
}

/**
 * @author Vijayan PP <vijayan.pp@pitsolutions.com>
 *
 * Function to set side navigation bar data
 * @param data
 * @param treeViewData
*/
export function setTreeViewData(data: Project, treeViewData: Array<Object>): Project {
    if (!!data) {
        return Object.assign({}, data, { treeViewData });
    } else {
        return;
    }
}

/**
 * @author Vijayan PP <vijayan.pp@pitsolutions.com>
 *
 * Function to set side navigation bar data
 * @param data
 * @param projectDetail
*/
export function setaProjectData(data: Project, currentProjectDetail: object): Project {
    if (!!data) {
        return Object.assign({}, data, { currentProjectDetail });
    } else {
        return;
    }
}


/**
 * @author Vijayan PP <vijayan.pp@pitsolutions.com>
 *
 * Function to set the currentProject id
 * @param data
 * @param projectDetail
*/
export function setaProjectId(data: Project, currentProjectId: object): Project {
    if (!!data) {

        return Object.assign(data, currentProjectId);
    } else {
        return;
    }
}


/**
 * @author Vijayan PP <vijayan.pp@pitsolutions.com>
 *
 * Function to set the currentProject id
 * @param data
 * @param projectDetail
*/
export function setCurrentPage(data: Project, currentPage: object): Project {
    if (!!data) {
        return Object.assign(data, currentPage);
    } else {
        return;
    }
}


/**
 * @author Vijayan PP <vijayan.pp@pitsolutions.com>
 *
 * Function to set Date Time
 * @param data
 * @param navbarData
*/
export function setDateTime(data: Project, dateTime: object): Project {
    if (!!data) {
        return Object.assign(data, dateTime);
    } else {
        return;
    }
}

