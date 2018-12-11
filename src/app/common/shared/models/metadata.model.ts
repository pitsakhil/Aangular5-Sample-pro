export interface Metadata {
    readonly metadataDetails: object;
    readonly statusDetails: object;
    readonly priorityDetails: object;
    readonly usersDetails: object;
    readonly permissionDetails: object;
    readonly delegateDetails: object;
    readonly userPermissionDetails: object;
    readonly projectDetails: object;
}

/**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to update metadata in store
*/
export function updateMetadata(data: Metadata, metadataDetails: Array<object>): Metadata {
    if (!!data) {
        return Object.assign({}, data, { metadataDetails });
    } else {
        return null;
    }
}

/**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to update status details in store
*/
export function updateStatus(data: Metadata, statusDetails: Array<object>): Metadata {
    if (!!data) {
        return Object.assign({}, data, { statusDetails });
    } else {
        return null;
    }
}

/**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to update priority details in store
*/
export function updatePriority(data: Metadata, priorityDetails: Array<object>): Metadata {
    if (!!data) {
        return Object.assign({}, data, { priorityDetails });
    } else {
        return null;
    }
}

/**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to update user details in store
*/
export function updateUsers(data: Metadata, usersDetails: Array<object>): Metadata {
    if (!!data) {
        return Object.assign({}, data, { usersDetails });
    } else {
        return null;
    }
}

/**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to update user details in store
*/
export function updateDelegateTo(data: Metadata, delegateDetails: Array<object>): Metadata {
    if (!!data) {
        return Object.assign({}, data, { delegateDetails });
    } else {
        return null;
    }
}

/**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to update user details in store
*/
export function updateDocumentPermission(data: Metadata, permissionDetails: Array<object>): Metadata {
    if (!!data) {
        return Object.assign({}, data, { permissionDetails });
    } else {
        return null;
    }
}

/**
 * @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
 *
 * Function to update user permissions in store
*/
export function updateUserPermission(data: Metadata, userPermissionDetails: Array<object>): Metadata {
    if (!!data) {
        return Object.assign({}, data, { userPermissionDetails });
    } else {
        return null;
    }

}

/**
* @author Sreekanth mn <sreekanth.mn@pitsolutions.com>
*
* Function to update user permissions in store
*/
export function updateProjects(data: Metadata, projectDetails: Array<object>): Metadata {
    if (!!data) {
        return Object.assign({}, data, { projectDetails });
    } else {
        return null;
    }
}