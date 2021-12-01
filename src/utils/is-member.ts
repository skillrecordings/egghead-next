export function isMember(viewer: any, customer?: any) {
  return (
    (customer && (customer.pro || customer.instructor)) ||
    (viewer && (viewer.is_pro || viewer.is_instructor))
  )
}
