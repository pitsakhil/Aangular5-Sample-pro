import { EventEmitter } from '@angular/core';

/**
 * Interface to represent different type of  Notification
 *
 *
 */
export interface Notification {
    id?: string
    type: string
    icon: string
    title?: string
    content?: string
    override?: any
    state?: string
    createdBy?: string
    createdOn?: Date
    destroyedOn?: Date
    html?: any
    animate?: string
    timeOut?: number
    maximumLength?: number
    pauseOnHover?: boolean
    clickToClose?: boolean
    theClass?: string
    click?: EventEmitter<{}>;
}