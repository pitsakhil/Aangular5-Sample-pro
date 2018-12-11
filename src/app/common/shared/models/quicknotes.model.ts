export interface Quicknotes {
    readonly quicknotesList: object;
    readonly quicknote: object;
    readonly saveQuicknote: object;
    readonly deleteQuickNote: object;
}

export class GlobalProfile {
    readonly userdata: any;
}

/**
 * @author David Raja <david.ra@pitsolutions.com>
 *
 * Function to update quicknotes list in store
*/
export function updateQuicknotesList(data: Quicknotes, quicknotesList: Array<object>): Quicknotes {
    if (!!data) {
        return Object.assign({}, data, { quicknotesList });
    } else {
        return null;
    }
}
/**
 * @author David Raja <david.ra@pitsolutions.com>
 *
 * Function to add quicknotes and update in store
*/
export function updateAddQuicknote(data: Quicknotes, quicknote: Array<object>): Quicknotes {
    if (!!data) {
        return Object.assign({}, data, { quicknote });
    } else {
        return null;
    }
}
/**
 * @author David Raja <david.ra@pitsolutions.com>
 *
 * Function to save quicknotes and update in store
*/
export function updateSaveQuicknote(data: Quicknotes, saveQuicknote: Array<object>): Quicknotes {
    if (!!data) {
        return Object.assign({}, data, { saveQuicknote });
    } else {
        return null;
    }
}
/**
 * @author David Raja <david.ra@pitsolutions.com>
 *
 * Function to delete quicknotes and update in store
*/
export function updateDeleteQuicknote(data: Quicknotes, deleteQuickNote: Array<object>): Quicknotes {
    if (!!data) {
        return Object.assign({}, data, { deleteQuickNote });
    } else {
        return null;
    }
}

