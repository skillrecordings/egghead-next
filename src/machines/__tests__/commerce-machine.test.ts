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

test('it transitions to pricesLoaded after fetching pricing data', (done) => {
  const mockedFunc = jest.fn()

  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (context) => {
        mockedFunc(context.quantity)

        return Promise.resolve()
      },
    },
  })

  const commerceService = interpret(mockedCommerceMachine).onTransition(
    (state) => {
      if (state.matches('pricesLoaded')) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(mockedFunc).toHaveBeenCalled()
        done()
      }
    },
  )

  commerceService.start()
})

test('it defaults to withoutCoupon when prices are loaded', (done) => {
  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (_context) => {
        return Promise.resolve()
      },
    },
  })

  const commerceService = interpret(mockedCommerceMachine).onTransition(
    (state) => {
      if (state.matches({pricesLoaded: 'withoutCoupon'})) {
        done()
      }
    },
  )

  commerceService.start()
})

test('it can apply PPP coupon when available', (done) => {
  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (_context) => {
        return Promise.resolve(pricingResponseWithPPPAvailable)
      },
    },
  })

  let sendOnce = false

  const commerceService = interpret(mockedCommerceMachine).onTransition(
    (state) => {
      if (state.matches({pricesLoaded: 'withoutCoupon'})) {
        if (!sendOnce) {
          commerceService.send('APPLY_PPP_COUPON')
          sendOnce = true
        }
      } else if (state.matches({pricesLoaded: 'withPPPCoupon'})) {
        done()
      }
    },
  )

  commerceService.start()
})

test('it recognizes an applied default coupon', (done) => {
  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (_context) => {
        return Promise.resolve(pricingResponseWithDefaultApplied)
      },
    },
  })

  const commerceService = interpret(mockedCommerceMachine).onTransition(
    (state) => {
      if (state.matches({pricesLoaded: 'withDefaultCoupon'})) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(state.context.couponToApply?.couponCode).toEqual('QJVIXHB6')
        done()
      }
    },
  )

  commerceService.start()
})

test('it switches price', (done) => {
  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (_context) => {
        return Promise.resolve(pricingResponseWithPPPAvailable)
      },
    },
  })

  let sendOnce = false

  const commerceService = interpret(mockedCommerceMachine).onTransition(
    (state) => {
      if (state.matches({pricesLoaded: 'withoutCoupon'})) {
        if (!sendOnce) {
          // the priceId has to be manually set, so it will start as undefined
          // eslint-disable-next-line jest/no-conditional-expect
          expect(state.context.priceId).toEqual(undefined)

          // switch the price to monthly
          commerceService.send({
            type: 'SWITCH_PRICE',
            priceId: 'price_monthly_id',
          })

          sendOnce = true
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(state.context.priceId).toEqual('price_monthly_id')
          done()
        }
      }
    },
  )

  commerceService.start()
})

test('it refetches prices when quantity changes', (done) => {
  const mockedFunc = jest.fn()

  const mockedCommerceMachine = commerceMachine.withConfig({
    services: {
      fetchPricingData: async (context) => {
        mockedFunc(context.quantity)

        return Promise.resolve(pricingResponseWithPPPAvailable)
      },
    },
  })

  let sendOnce = false

  const commerceService = interpret(mockedCommerceMachine).onTransition(
    (state) => {
      if (state.matches({pricesLoaded: 'withoutCoupon'})) {
        if (!sendOnce) {
          commerceService.send({type: 'CHANGE_QUANTITY', quantity: 10})
          sendOnce = true
        } else {
          // first called with 1, then called with 10
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mockedFunc).toHaveBeenNthCalledWith(1, 1)
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mockedFunc).toHaveBeenNthCalledWith(2, 10)

          done()
        }
      }
    },
  )

  commerceService.start()
})
