export interface HandoverHistory {
    readonly handoverList: object;
}

export function updateHandoverList(data: HandoverHistory, handoverList: Array<Object>): HandoverHistory {
    /**
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * Function to update handover history list data
    */
    if (!!data) {
        return Object.assign({}, data, { handoverList });
    } else {
        return null;
    }
}
