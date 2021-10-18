import {createMachine, assign} from 'xstate'
import {loadPricingData} from 'lib/prices'
import isEmpty from 'lodash/isEmpty'

type PricingPlan = {
  interval: string
  interval_count: number
  name: string
  price: number
  stripe_price_id: string
}

export type Coupon = {
  coupon_code: string
  coupon_discount: number
  coupon_region_restricted_to: string
  coupon_region_restricted_to_name: string
  coupon_expires_at: number
}

export type PricingData = {
  applied_coupon: string
  available_coupons: {
    ppp: Coupon | undefined
  }
  coupon_code_errors: string[]
  mode: 'individual' | 'team'
  plans: PricingPlan[]
  quantity: number
}

type CouponToApply = {
  couponCode: string
  couponType: 'ppp' | 'other'
}

const findAvailablePPPCoupon = (pricingData: PricingData) => {
  return pricingData?.available_coupons?.ppp
}

export interface CommerceMachineContext {
  pricingData: PricingData
  priceId: string | undefined
  quantity: number
  couponToApply: CouponToApply | undefined
}

type CommerceMachineEvent =
  | {
      type: 'CHANGE_QUANTITY'
      quantity: number
    }
  | {type: 'REMOVE_PPP_COUPON'}
  | {type: 'APPLY_PPP_COUPON'}
  | {type: 'CONFIRM_PRICE'; onClickCheckout: Function}
  | {type: 'SWITCH_PRICE'; priceId: string}
  | {type: 'done.invoke.fetchPricingDataService'; data: PricingData}

export const commerceMachine = createMachine<
  CommerceMachineContext,
  CommerceMachineEvent
>(
  {
    id: 'commerce',
    context: {
      pricingData: {} as PricingData,
      priceId: undefined as string | undefined,
      quantity: 1,
      couponToApply: undefined as CouponToApply | undefined,
    },
    initial: 'loadingPrices',
    on: {
      CHANGE_QUANTITY: {
        target: '.debouncingQuantityChange',
        actions: ['updateQuantity'],
      },
    },
    states: {
      loadingPrices: {
        id: 'loadingPrices',
        invoke: {
          id: 'fetchPricingDataService',
          src: 'fetchPricingData',
          onDone: {
            target: 'pricesLoaded',
            actions: ['assignPricingData'],
          },
          onError: {
            target: 'pricingFetchFailed',
          },
        },
      },
      debouncingQuantityChange: {
        on: {
          CHANGE_QUANTITY: {
            target: 'debouncingQuantityChange',
            actions: ['updateQuantity'],
          },
        },
        after: {
          500: {
            target: '#loadingPrices',
          },
        },
      },
      pricesLoaded: {
        initial: 'checkingCouponStatus',
        on: {
          SWITCH_PRICE: {
            actions: assign({
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
      fetchPricingData: async (context): Promise<PricingData | undefined> => {
        return await loadPricingData({
          quantity: context.quantity,
          coupon: context.couponToApply?.couponCode,
        })
      },
    },
    actions: {
      assignPricingData: assign(
        (_, event) => {
          if (event.type !== 'done.invoke.fetchPricingDataService') return {}

          return {pricingData: event.data}
        },
        // TODO: Move the `priceId` update from the downstream component up
        // this machine.
        //
        // priceId: (context, event) => {
        //   // look up which interval is selected and then find the stripe_price_id
        //   // for that plan and then return it as the priceId value.
        //   event.
        // }
      ),
      updateQuantity: assign((_, event) => {
        if (event.type !== 'CHANGE_QUANTITY') return {}

        return {
          quantity: event.quantity,
        }
      }),
      applyPPPCoupon: assign({
        couponToApply: (context) => {
          const pppCoupon = findAvailablePPPCoupon(context.pricingData)
          const couponToApply = pppCoupon?.coupon_code
            ? ({
                couponCode: pppCoupon?.coupon_code,
                couponType: 'ppp',
              } as CouponToApply)
            : undefined
          return couponToApply
        },
      }),
      removePPPCoupon: assign({
        couponToApply: (_context) => {
          return undefined
        },
      }),
    },
    guards: {
      pricingIncludesPPPCoupon: (context) => {
        return context?.couponToApply?.couponType === 'ppp'
      },
      priceHasBeenSelected: (context) => {
        return !isEmpty(context.priceId)
      },
    },
  },
)
