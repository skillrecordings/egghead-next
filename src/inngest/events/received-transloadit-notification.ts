export const RECEIVED_TRANSLOADIT_NOTIFICATION_EVENT =
  'transloadit/notification-received'

export type ReceivedTransloaditNotification = {
  name: typeof RECEIVED_TRANSLOADIT_NOTIFICATION_EVENT
  data: any
}
