import {createMachine, assign} from 'xstate'
import {loadPricingData} from 'lib/prices'
import isEmpty from 'lodash/isEmpty'

export type PricingPlan = {
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
  default?: boolean
}

export type PricingData = {
  applied_coupon: Coupon
  available_coupons: {
    ppp?: Coupon
    default?: Coupon
  }
  coupon_code_errors: string[]
  mode: 'individual' | 'team'
  plans: PricingPlan[]
  quantity: number
}

type CouponToApply = {
  couponCode: string
  couponType: 'ppp' | 'default'
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
              {
                target: 'withDefaultCoupon',
                cond: 'pricingIncludesDefaultCoupon',
              },
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
          withDefaultCoupon: {},
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

          const extractAppliedDefaultCoupon = (
            pricingData: PricingData,
          ): {couponToApply: CouponToApply} | {} => {
            // check if there is a site-wide/'default' coupon available
            const availableDefaultCoupon =
              pricingData?.available_coupons?.default

            // check if there is a site-wide/'default' coupon being applied
            const appliedCoupon = pricingData?.applied_coupon

            // no applied default coupon found
            if (isEmpty(availableDefaultCoupon) || isEmpty(appliedCoupon)) {
              return {}
            }

            // if a site-wide/'default' coupon is being applied, set that as the
            // `couponToApply` in the machine context. The CouponToApply is
            // needed when transitioning to the Stripe Checkout Session.
            if (
              availableDefaultCoupon?.coupon_code === appliedCoupon?.coupon_code
            ) {
              return {
                couponToApply: {
                  couponCode: appliedCoupon.coupon_code,
                  couponType: 'default',
                },
              }
            }

            // the applied coupon is not the site-wide/'default'
            return {}
          }

          return {
            pricingData: event.data,
            ...extractAppliedDefaultCoupon(event.data),
          }
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
      pricingIncludesDefaultCoupon: (context) => {
        return context?.couponToApply?.couponType === 'default'
      },
      priceHasBeenSelected: (context) => {
        return !isEmpty(context.priceId)
      },
    },
  },
)
