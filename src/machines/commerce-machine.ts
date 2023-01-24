import {createMachine, assign} from 'xstate'
import {loadPricingData} from 'lib/prices'
import isEmpty from 'lodash/isEmpty'
import {PricingData} from 'types'

type CouponToApply = {
  couponCode: string
  couponType: 'ppp' | 'default'
}

const findAvailablePPPCoupon = (pricingData: PricingData) => {
  return pricingData?.available_coupons?.ppp
}

const extractAppliedDefaultCoupon = (
  pricingData: PricingData,
): {couponToApply: CouponToApply} | {} => {
  // check if there is a site-wide/'default' coupon available
  const availableDefaultCoupon = pricingData?.available_coupons?.default

  // check if there is a site-wide/'default' coupon being applied
  const appliedCoupon = pricingData?.applied_coupon

  // no applied default coupon found
  if (isEmpty(availableDefaultCoupon) || isEmpty(appliedCoupon)) {
    return {}
  }

  // if a site-wide/'default' coupon is being applied, set that as the
  // `couponToApply` in the machine context. The CouponToApply is
  // needed when transitioning to the Stripe Checkout Session.
  if (availableDefaultCoupon?.coupon_code === appliedCoupon?.coupon_code) {
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
            actions: ['switchPriceIdAndAssociatedData'],
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
          withDefaultCoupon: {
            on: {
              APPLY_PPP_COUPON: {
                actions: 'applyPPPCoupon',
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
        let params = new URLSearchParams(window.location.search)
        return await loadPricingData({
          quantity: context.quantity,
          coupon:
            context.couponToApply?.couponCode ||
            (params.get('coupon') as string),
        })
      },
    },
    actions: {
      switchPriceIdAndAssociatedData: assign((context, event) => {
        if (event.type !== 'SWITCH_PRICE') return {}

        const currentPlan = context.pricingData.plans.find(
          (plan) => plan.stripe_price_id === event.priceId,
        )
        const noCouponToApply = !currentPlan?.price_discounted
        const couponData = noCouponToApply
          ? {couponToApply: undefined}
          : extractAppliedDefaultCoupon(context.pricingData)

        return {
          priceId: event.priceId,
          ...couponData,
        }
      }),
      assignPricingData: assign(
        (_, event) => {
          if (event.type !== 'done.invoke.fetchPricingDataService') return {}

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
