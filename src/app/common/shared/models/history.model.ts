export interface History {
    readonly historyListData: object;
}

export function updateHistoryList(data: History, historyListData: Array<Object>): History {
    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to update history list data
    */
    if (!!data) {
        return Object.assign({}, data, { historyListData });
    } else {
        return null;
    }
}
