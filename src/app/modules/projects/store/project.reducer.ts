import { Action } from '@ngrx/store';
import { ProjectActions } from './project.actions';
import { Project, setProjectDocumentData, setTreeViewData, setaProjectId, setCurrentPage, setDateTime } from '../models/index';
import { setaProjectData } from '../models/project.model';


export function ProjectReducer(
    // tslint:disable-next-line:max-line-length
    project: Project = { projectDocumentsData: [], treeViewData: [], currentProjectDetail: {}, currentProjectId: 0, currentPage: '', dateTime: {} },
    action: Action
): Project {
    switch (action.type) {
        case ProjectActions.UPDATE_PROJECTS_DOCUMENT_DATA:
            return setProjectDocumentData(project, action['payload']);
        case ProjectActions.UPDATE_PROJECT_TREEVIEW:
            return setTreeViewData(project, action['payload']);
        case ProjectActions.UPDATE_PROJECT_DETAIL:
            return setaProjectData(project, action['payload']);
        case ProjectActions.RESET_PROJECT_TREEVIEW:
            return setTreeViewData(project, []);
        case ProjectActions.UPDATE_PROJECT_ID:
            return setaProjectId(project, action['payload']);
        case ProjectActions.UPDATE_CURRENT_PAGE:
            return setCurrentPage(project, action['payload']);
        case ProjectActions.UPDATE_DATE_TIME:
            return setDateTime(project, action['payload']);

        default:
            return project;
    }
}
