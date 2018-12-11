import { FormGroup } from '@angular/forms';

export interface MetadataVariables {
    templateData?: object;
    metadataForm?: FormGroup;
    statusData?: Array<object>;
    priorityData?: Array<object>;
    responsibleData?: Array<object>;
    delegateData?: Array<object>;
    permissionData?: Array<object>;
    projectData?: Array<object>;
    metadata?: object;
    status?: number;
    priority?: number;
    responsible?: number;
    created$?: string;
    edited$?: string;
    nodeId?: number;
    documentNumber?: string;
    permission?: number;
    projects?: Array<object>;
    notes?: string;
    deadline_hour?: string;
    deadline_minute?: string;
}

export interface Body {
    status?: number;
    priority?: number;
    responsible?: number;
    folder?: number;
    sf_permission?: number;
    project_ids?: string;
}


