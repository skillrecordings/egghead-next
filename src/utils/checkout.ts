import {track} from '@/utils/analytics'
import emailIsValid from '@/utils/email-is-valid'
import {
  redirectToStandardCheckout,
  redirectToSubscriptionCheckout,
} from '@/api/stripe/stripe-checkout-redirect'
import axios from 'axios'
import toast from 'react-hot-toast'
import {Router} from 'next/router'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'

const checkProAccess = async (email: string) => {
  const {hasProAccess} = await axios
    .post(`/api/users/check-pro-status`, {email})
    .then(({data}) => data)
  return hasProAccess
}

const handleProAccess = (email: string) => {
  const message = `You already have pro access with this account (${email}). Please contact support@egghead.io if you need help with your membership.`
  toast.error(message, {
    duration: 6000,
    icon: '❌',
  })
}

const redirectToCheckout = (
  isLifetime: boolean,
  priceId: string,
  email: string,
  authToken: string,
  quantity: number,
  couponCode?: string,
) => {
  if (isLifetime) {
    redirectToStandardCheckout({
      priceId,
      email,
      authToken,
      quantity,
      successPath: '/confirm/forever',
      cancelPath: '/pricing/forever',
    })
  } else {
    redirectToSubscriptionCheckout({
      priceId,
      email,
      authToken,
      quantity,
      coupon: couponCode,
    })
  }
}

/**
 * Handles the checkout process for a given price plan.
 *
 * @param {string} priceId - The ID of the price plan.
 * @param {number} quantity - The quantity of the plan.
 * @param {any} viewer - The viewer object containing user details.
 * @param {string} authToken - The authentication token for the user.
 * @param {Router | AppRouterInstance} router - The Next.js router instance.
 * @param {(loaderOn: boolean) => void} setLoaderOn - Function to set the loader state.
 * @param {boolean} [isLifetime=false] - Flag indicating if the plan is a lifetime plan.
 * @param {string} [couponCode] - Optional coupon code for the plan.
 * @returns {Promise<void>}
 */
export const handleCheckout = async (
  priceId: string,
  quantity: number,
  viewer: any,
  authToken: string,
  router: Router | AppRouterInstance,
  setLoaderOn: (loaderOn: boolean) => void,
  isLifetime: boolean = false,
  couponCode?: string,
): Promise<void> => {
  if (!priceId) {
    console.error('handleCheckout: priceId is required')
    return
  }
  track(`${isLifetime ? 'lifetime ' : ''}checkout: selected plan`, {priceId})

  const email = viewer?.email
  if (emailIsValid(email)) {
    if (!isLifetime) {
      const hasProAccess = await checkProAccess(email)
      if (hasProAccess) {
        handleProAccess(email)
        return
      }
    }

    track(`${isLifetime ? 'lifetime ' : ''}checkout: valid email present`, {
      priceId,
    })
    track(`${isLifetime ? 'lifetime ' : ''}checkout: redirect to stripe`, {
      priceId,
    })
    redirectToCheckout(
      isLifetime,
      priceId,
      email,
      authToken,
      quantity,
      couponCode,
    )
  } else {
    track('checkout: get email', {priceId})
    router.push(
      `${
        isLifetime ? '/forever/email?' : '/pricing/email?'
      }${new URLSearchParams({
        priceId,
        quantity: quantity.toString(),
        ...(couponCode && {coupon: couponCode}),
      })}`,
    )
    setLoaderOn(true)
  }
}
