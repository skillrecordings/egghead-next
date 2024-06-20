export const VERIFIED_TRANSLOADIT_NOTIFICATION_EVENT =
  'transloadit/notification-verified'

export type VerifiedTransloaditNotification = {
  name: typeof VERIFIED_TRANSLOADIT_NOTIFICATION_EVENT
  data: any
}
