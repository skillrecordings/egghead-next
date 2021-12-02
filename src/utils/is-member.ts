export function isMember(viewer: any, customer?: any) {
  return (
    (customer &&
      (customer.pro ||
        customer.instructor ||
        [customer.instructor, customer.pro].includes('true'))) ||
    (viewer && (viewer.is_pro || viewer.is_instructor))
  )
}
