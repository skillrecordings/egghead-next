import {
  findPastWorkshopLineItem,
  isPastWorkshopSession,
  sessionPaymentIntentId,
  toWorkshopTransaction,
  WorkshopSession,
} from './workshop-transactions'

describe('workshop checkout sessions', () => {
  const productIds = ['prod_cursor', 'prod_claude']

  const session = (
    overrides: Partial<WorkshopSession> = {},
  ): WorkshopSession => ({
    payment_status: 'paid',
    payment_intent: 'pi_123',
    amount_total: 25000,
    customer_details: {email: 'session@example.com'},
    line_items: {
      data: [
        {description: 'Sticker', price: {product: 'prod_other'}},
        {
          description: 'Cursor Workshop',
          price: {product: 'prod_cursor'},
        },
      ],
    },
    ...overrides,
  })

  const charge = {
    id: 'ch_123',
    amount: 24000,
    created: 1_700_000_000,
    description: 'Charge description',
    billing_details: {email: 'buyer@example.com'},
    metadata: {},
  }

  it('keeps paid sessions with a past workshop line item', () => {
    expect(isPastWorkshopSession(session(), productIds)).toBe(true)
  })

  it('matches expanded product objects on the price', () => {
    expect(
      isPastWorkshopSession(
        session({
          line_items: {
            data: [
              {price: {product: {id: 'prod_claude', name: 'Claude Code'}}},
            ],
          },
        }),
        productIds,
      ),
    ).toBe(true)
  })

  it('rejects unpaid sessions', () => {
    expect(
      isPastWorkshopSession(session({payment_status: 'unpaid'}), productIds),
    ).toBe(false)
  })

  it('rejects sessions without a past workshop product', () => {
    expect(
      isPastWorkshopSession(
        session({line_items: {data: [{price: {product: 'prod_other'}}]}}),
        productIds,
      ),
    ).toBe(false)
    expect(
      isPastWorkshopSession(
        session({line_items: {data: [{price: null}]}}),
        productIds,
      ),
    ).toBe(false)
    expect(isPastWorkshopSession(session({line_items: null}), productIds)).toBe(
      false,
    )
  })

  it('rejects all sessions when no past workshops are configured', () => {
    expect(isPastWorkshopSession(session(), [])).toBe(false)
  })

  it('reads the payment intent id as a string or an expanded object', () => {
    expect(sessionPaymentIntentId(session())).toBe('pi_123')
    expect(
      sessionPaymentIntentId(session({payment_intent: {id: 'pi_456'}})),
    ).toBe('pi_456')
    expect(
      sessionPaymentIntentId(session({payment_intent: null})),
    ).toBeUndefined()
  })

  it('maps a session and its charge to the transaction shape', () => {
    expect(
      toWorkshopTransaction(session(), charge, productIds, 'user@example.com'),
    ).toEqual({
      id: 'ch_123',
      charge_id: 'ch_123',
      amount: 24000,
      created_at: new Date(1_700_000_000 * 1000).toISOString(),
      customer_email: 'buyer@example.com',
      product_name: 'Cursor Workshop',
      workshop_type: 'cursor',
    })
  })

  it('falls back to the product name, session amount and emails', () => {
    const transaction = toWorkshopTransaction(
      session({
        line_items: {
          data: [
            {
              description: '',
              price: {
                product: {id: 'prod_claude', name: 'Claude Code Workshop'},
              },
            },
          ],
        },
      }),
      {...charge, amount: 0, billing_details: {email: null}},
      productIds,
      'user@example.com',
    )

    expect(transaction.product_name).toBe('Claude Code Workshop')
    expect(transaction.workshop_type).toBe('claude-code')
    expect(transaction.amount).toBe(25000)
    expect(transaction.customer_email).toBe('session@example.com')

    expect(
      toWorkshopTransaction(
        session({customer_details: null}),
        {...charge, billing_details: null},
        productIds,
        'user@example.com',
      ).customer_email,
    ).toBe('user@example.com')
  })

  it('keeps the workshop_type charge metadata override', () => {
    expect(
      toWorkshopTransaction(
        session(),
        {...charge, metadata: {workshop_type: 'claude-code'}},
        productIds,
        'user@example.com',
      ).workshop_type,
    ).toBe('claude-code')
  })

  it('returns the first matching workshop line item', () => {
    expect(findPastWorkshopLineItem(session(), productIds)?.description).toBe(
      'Cursor Workshop',
    )
  })
})
