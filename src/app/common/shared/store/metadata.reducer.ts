import { Action } from '@ngrx/store';
import { MetadataActions } from './metadata.actions';
import {
    Metadata,
    updateMetadata,
    updateStatus,
    updatePriority,
    updateUsers,
    updateDelegateTo,
    updateDocumentPermission,
    updateUserPermission,
    updateProjects

} from '../models/metadata.model';

export function MetadataReducer(
    // tslint:disable-next-line:max-line-length
    metadata: Metadata = { metadataDetails: {}, statusDetails: {}, priorityDetails: {}, usersDetails: {}, delegateDetails: {}, permissionDetails: {}, userPermissionDetails: {}, projectDetails: {} },
    action: Action
): Metadata {
    switch (action.type) {
        case MetadataActions.UPDATE_METADATA:
            return updateMetadata(metadata, action['payload']);
        case MetadataActions.UPDATE_STATUS:
            return updateStatus(metadata, action['payload']);
        case MetadataActions.UPDATE_PRIORITY:
            return updatePriority(metadata, action['payload']);
        case MetadataActions.UPDATE_USERS:
            return updateUsers(metadata, action['payload']);
        case MetadataActions.UPDATE_DELEGATE_TO:
            return updateDelegateTo(metadata, action['payload']);
        case MetadataActions.UPDATE_DOCUMENT_PERMISSION:
            return updateDocumentPermission(metadata, action['payload']);
        case MetadataActions.UPDATE_USER_PERMISSIONS:
            return updateUserPermission(metadata, action['payload']);
        case MetadataActions.UPDATE_PROJECTS:
            return updateProjects(metadata, action['payload']);
        default:
            return metadata;
    }
}
