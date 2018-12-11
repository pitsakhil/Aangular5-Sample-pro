export interface CreateProjectVariable {
    config?: object;
    data?: object;
    documentId?: number;
    projectId?: number;
    moduleId: number;
    confirmMessageKey$?: string;
    isPriority?: boolean;
    viewHistory?: boolean;
    editMode?: boolean;
    currentResponse?: object;
    isApiComplete?: boolean;
}
