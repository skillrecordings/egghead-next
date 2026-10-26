import {
  buildWorkshopChargesQuery,
  isPastWorkshopCharge,
} from './workshop-transactions'

describe('workshop charge search', () => {
  const productIds = ['prod_cursor', 'prod_claude']

  it('uses only AND while retaining charges for multiple workshop products', () => {
    const query = buildWorkshopChargesQuery('buyer@example.com')

    expect(query).toBe(
      "billing_details.email:'buyer@example.com' AND status:'succeeded'",
    )
    expect(query).not.toContain(' OR ')
    for (const productId of productIds) {
      expect(isPastWorkshopCharge({metadata: {productId}}, productIds)).toBe(true)
    }
  })

  it('escapes backslashes before single quotes in the email', () => {
    expect(buildWorkshopChargesQuery("buyer\\'name@example.com")).toBe(
      "billing_details.email:'buyer\\\\\\'name@example.com' AND status:'succeeded'",
    )
  })

  it('accepts the alternate product_id metadata key', () => {
    expect(
      isPastWorkshopCharge({metadata: {product_id: 'prod_claude'}}, productIds),
    ).toBe(true)
  })

  it('accepts either matching key even when the other key is unrelated', () => {
    expect(
      isPastWorkshopCharge(
        {metadata: {productId: 'prod_other', product_id: 'prod_cursor'}},
        productIds,
      ),
    ).toBe(true)
  })

  it('rejects unrelated charges and missing product metadata', () => {
    expect(
      isPastWorkshopCharge({metadata: {productId: 'prod_other'}}, productIds),
    ).toBe(false)
    expect(isPastWorkshopCharge({metadata: {}}, productIds)).toBe(false)
    expect(isPastWorkshopCharge({}, productIds)).toBe(false)
  })

  it('rejects all charges when no past workshops are configured', () => {
    expect(isPastWorkshopCharge({metadata: {productId: 'prod_cursor'}}, [])).toBe(
      false,
    )
  })
})
