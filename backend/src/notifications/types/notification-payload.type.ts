export enum NotificationType {
  NEW_REQUEST = 'newRequest',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface NotificationPayload {
  // тип уведомления
  type: NotificationType;
  // название навыка
  skillTitle: string;
  // пользователь, от которого поступило уведомление
  fromUser: string;
}
