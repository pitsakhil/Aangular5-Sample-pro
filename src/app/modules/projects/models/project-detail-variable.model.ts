export interface ProjectDetailVariable {
    config?: object;
    data?: object;
    viewHistory?: boolean;
    documentId?: number;
    moduleId: number;
    projectId: number;
    confirmMessageKey$?: string;
    confirmDeleteMessageKey$: string;
    isPriority?: boolean;
    editMode?: boolean;
    isApiComplete?: boolean;
    responseMessage?: string;
    patchValue?: any;
    currenResponse?: object;
    isHandover?: boolean;
    projectData?:object;
}
