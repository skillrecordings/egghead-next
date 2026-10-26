export const buildWorkshopChargesQuery = (email: string) => {
  const escapedEmail = email.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  return `billing_details.email:'${escapedEmail}' AND status:'succeeded'`
}

export const isPastWorkshopCharge = (
  charge: {metadata?: Record<string, string>},
  productIds: string[],
) =>
  productIds.some(
    (id) =>
      charge.metadata?.productId === id || charge.metadata?.product_id === id,
  )
