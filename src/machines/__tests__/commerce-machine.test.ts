import {commerceMachine} from '../commerce-machine'
import {interpret} from 'xstate'

const pricingResponseWithPPPAvailable = {
  mode: 'individual',
  quantity: 1,
  applied_coupon: null,
  coupon_code_errors: [],
  available_coupons: {
    ppp: {
      coupon_discount: 0.6,
      coupon_code: 'CBBM9QUC',
      coupon_expires_at: 1634184638,
      default: false,
      price_message: 'Restricted Regional Pricing (BR)',
      coupon_region_restricted: true,
      coupon_region_restricted_to: 'BR',
      coupon_region_restricted_to_name: 'Brazil',
    },
  },
  plans: [
    {
      name: 'Monthly',
      price: 25,
      interval: 'month',
      interval_count: 1,
      stripe_price_id: 'price_monthly_id',
    },
    {
      name: 'Quarterly',
      price: 70,
      interval: 'month',
      interval_count: 3,
      stripe_price_id: 'price_quarterly_id',
    },
    {
      name: 'Yearly',
      price: 250,
      interval: 'year',
      interval_count: 1,
      stripe_price_id: 'price_yearly_id',
    },
  ],
}

const pricingResponseWithDefaultApplied = {
  mode: 'individual',
  quantity: 1,
  applied_coupon: {
    coupon_discount: 0.5,
    coupon_code: 'QJVIXHB6',
    coupon_expires_at: 1639814399,
    default: true,
    coupon_region_restricted: false,
  },
  coupon_code_errors: [],
  available_coupons: {
    default: {
      coupon_discount: 0.5,
      coupon_code: 'QJVIXHB6',
      coupon_expires_at: 1639814399,
      default: true,
      coupon_region_restricted: false,
    },
    ppp: {
      coupon_discount: 0.6,
      coupon_code: 'Y48OGYPR',
      coupon_expires_at: 1637662621,
      default: false,
      price_message: 'Restricted Regional Pricing (BR)',
      coupon_region_restricted: true,
      coupon_region_restricted_to: 'BR',
      coupon_region_restricted_to_name: 'Brazil',
    },
  },
  plans: [
    {
      name: 'Monthly',
      price: 25,
      interval: 'month',
      interval_count: 1,
      stripe_price_id: 'price_monthly_id',
      price_discounted: 12,
      price_savings: 13,
    },
    {
      name: 'Quarterly',
      price: 70,
      interval: 'month',
      interval_count: 3,
      stripe_price_id: 'price_quarterly_id',
      price_discounted: 35,
      price_savings: 35,
    },
    {
      name: 'Yearly',
      price: 250,
      interval: 'year',
      interval_count: 1,
      stripe_price_id: 'price_yearly_id',
      price_discounted: 125,
      price_savings: 125,
    },
  ],
}

test('it starts fetching pricing immediately', () => {
  const commerceService = interpret(commerceMachine)

  commerceService.start()

  expect(commerceService.state.value).toEqual('loadingPrices')
})

test('it invokes the given fetchPricingData service', () => {
  const mockedFunc = jest.fn()

  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (context) => {
        mockedFunc(context.quantity)

        return Promise.resolve()
      },
    },
  })

  const commerceService = interpret(mockedCommerceMachine)

  commerceService.start()

  expect(mockedFunc).toHaveBeenCalled()
})

function sleep(time) {
  return new Promise((resolve) => {
    return setTimeout(resolve, time)
  })
}

test('it transitions to pricesLoaded after fetching pricing data', async () => {
  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (_context) => {
        return Promise.resolve()
      },
    },
  })

  const commerceService = interpret(mockedCommerceMachine)

  commerceService.start()

  expect(commerceService.state).toMatchState('loadingPrices')

  await sleep(0)

  expect(commerceService.state).toMatchState('pricesLoaded')
})

test('it defaults to withoutCoupon when prices are loaded', async () => {
  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (_context) => {
        return Promise.resolve()
      },
    },
  })

  const commerceService = interpret(mockedCommerceMachine)

  commerceService.start('pricesLoaded')

  expect(commerceService.state.matches('pricesLoaded')).toBe(true)

  // await sleep(0)

  // TODO: I'd expect this to transition to `withoutCoupon`, but it gets stuck
  // in `checkingCouponStatus`.
  expect(commerceService.state).toMatchState({
    pricesLoaded: 'checkingCouponStatus',
  })
  // expect(commerceService.state).toMatchState({pricesLoaded: 'withoutCoupon'})
})

test('it can apply PPP coupon when available', async () => {
  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (_context) => {
        return Promise.resolve(pricingResponseWithPPPAvailable)
      },
    },
  })

  const commerceService = interpret(mockedCommerceMachine)

  commerceService.start()

  await sleep(0)

  // TODO: Update the machine to set the priceId once pricing data loads. It
  // doesn't make sense for it to be undefined once it is in `pricesLoaded`.
  expect(commerceService.state.context.priceId).toEqual(undefined)
})

test('it recognizes an applied default coupon', async () => {
  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (_context) => {
        return Promise.resolve(pricingResponseWithDefaultApplied)
      },
    },
  })

  const commerceService = interpret(mockedCommerceMachine)

  commerceService.start()

  await sleep(0)

  // expect(commerceService.state.context.priceId).toEqual(undefined)
  expect(commerceService.state.context.couponToApply?.couponCode).toEqual(
    'QJVIXHB6',
  )
})

test('it switches price without going back to loadingPrices', () => {
  const commerceService = interpret(commerceMachine)

  commerceService.start({pricesLoaded: 'withoutCoupon'})

  commerceService.send({type: 'SWITCH_PRICE', priceId: 'priceId123'})

  expect(commerceService.state.context.priceId).toEqual('priceId123')
})

xtest('it goes back to loadingPrices when quantity changes', async () => {
  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (_context) => {
        return Promise.resolve(pricingResponseWithPPPAvailable)
      },
    },
  })

  const commerceService = interpret(mockedCommerceMachine)

  commerceService.start({pricesLoaded: 'withoutCoupon'})

  commerceService.send({type: 'CHANGE_QUANTITY', quantity: 10})

  await sleep(750)

  expect(commerceService.state).toMatchState('loadingPrices')
})
