import { Notification } from './notification.type';

export interface NotificationEvent {
    command: string;
    add?: boolean;
    id?: string;
    notification?: Notification;
}