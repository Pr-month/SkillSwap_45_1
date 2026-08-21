export declare enum NotificationType {
    NEW_REQUEST = "newRequest",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}
export interface NotificationPayload {
    type: NotificationType;
    skillTitle: string;
    fromUser: string;
}
