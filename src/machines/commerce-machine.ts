import {createModel} from 'xstate/lib/model'
import {loadPricingData} from 'lib/prices'
import isEmpty from 'lodash/isEmpty'

type PricingPlan = {
  interval: string
  interval_count: number
  name: string
  price: number
  stripe_price_id: string
}

export type PricingData = {
  applied_coupon: string
  available_coupons: {
    ppp:
      | {
          coupon_code: string
        }
      | undefined
  }
  coupon_code_errors: string[]
  mode: 'individual' | 'team'
  plans: PricingPlan[]
  quantity: number
}

type Coupon = {
  couponCode: string
  couponType: 'ppp' | 'other'
}

const findAvailablePPPCoupon = (pricingData: PricingData) => {
  return pricingData?.available_coupons?.ppp
}

const commerceModel = createModel(
  {
    pricingData: {} as PricingData,
    priceId: undefined as string | undefined,
    quantity: 1,
    couponToApply: undefined as Coupon | undefined,
  },
  {
    events: {
      CHANGE_QUANTITY: (quantity: number) => ({quantity}),
      REMOVE_PPP_COUPON: () => ({}),
      APPLY_PPP_COUPON: () => ({}),
      CONFIRM_PRICE: (onClickCheckout: Function) => ({onClickCheckout}),
      SWITCH_PRICE: (priceId: string) => ({priceId}),
      'done.invoke.fetchPricingData': (data: PricingData) => ({data}),
    },
  },
)

const assignPricingData = commerceModel.assign(
  {
    pricingData: (_, event) => event.data,
  },
  'done.invoke.fetchPricingData',
)

export const commerceMachine = commerceModel.createMachine(
  {
    id: 'commerce',
    context: commerceModel.initialContext,
    initial: 'loadingPrices',
    states: {
      loadingPrices: {
        id: 'loadingPrices',
        invoke: {
          id: 'fetchPricingData',
          src: 'fetchPricingData',
          onDone: {
            target: 'pricesLoaded',
            actions: [assignPricingData],
          },
          onError: {
            target: 'pricingFetchFailed',
          },
        },
      },
      pricesLoaded: {
        initial: 'checkingCouponStatus',
        on: {
          CHANGE_QUANTITY: {
            target: '.debouncingQuantityChange',
            actions: commerceModel.assign({
              quantity: (_context, event) => event.quantity,
            }),
          },
          SWITCH_PRICE: {
            actions: commerceModel.assign({
              priceId: (_context, event) => event.priceId,
            }),
          },
          CONFIRM_PRICE: {
            actions: async (_context, event) => {
              const {onClickCheckout} = event
              await onClickCheckout()
            },
          },
        },
        states: {
          debouncingQuantityChange: {
            on: {
              CHANGE_QUANTITY: {
                target: 'debouncingQuantityChange',
                actions: commerceModel.assign({
                  quantity: (_context, event) => event.quantity,
                }),
              },
            },
            after: {
              500: {
                target: '#loadingPrices',
              },
            },
          },
          checkingCouponStatus: {
            always: [
              {target: 'withPPPCoupon', cond: 'pricingIncludesPPPCoupon'},
              {target: 'withoutCoupon'},
            ],
          },
          withPPPCoupon: {
            on: {
              REMOVE_PPP_COUPON: {
                actions: 'removePPPCoupon',
                target: '#loadingPrices',
              },
            },
          },
          withoutCoupon: {
            on: {
              APPLY_PPP_COUPON: {
                actions: 'applyPPPCoupon',
                target: '#loadingPrices',
              },
            },
          },
        },
      },
      pricingFetchFailed: {
        // TODO: Any actions that should happen here?
        type: 'final',
      },
    },
  },
  {
    services: {
      fetchPricingData: async (context) => {
        return await loadPricingData({
          quantity: context.quantity,
          coupon: context.couponToApply?.couponCode,
        })
      },
      checkoutSessionFetcher: async () => {},
    },
    actions: {
      applyPPPCoupon: commerceModel.assign({
        couponToApply: (context) => {
          const pppCoupon = findAvailablePPPCoupon(context.pricingData)
          const couponToApply = pppCoupon?.coupon_code
            ? ({
                couponCode: pppCoupon?.coupon_code,
                couponType: 'ppp',
              } as Coupon)
            : undefined
          return couponToApply
        },
      }),
      removePPPCoupon: commerceModel.assign({
        couponToApply: (_context) => {
          return undefined
        },
      }),
    },
    guards: {
      pricingIncludesPPPCoupon: (context) => {
        return context.couponToApply?.couponType === 'ppp'
      },
      priceHasBeenSelected: (context) => {
        return !isEmpty(context.priceId)
      },
    },
  },
)
