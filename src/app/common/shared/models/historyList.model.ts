export interface ListHistoryData {
    document_id?: string;
    start_page?: number;
    sort_by?: string;
    sort_order?: string;
    count?: number;
    viewHistory?: boolean;
    viewHandover?: boolean;
    actions?: Array<Object>;
    params?: any;
}
