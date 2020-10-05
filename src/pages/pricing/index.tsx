import * as React from 'react'
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import {FormEvent} from 'react'
import axios from 'utils/configured-axios'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('no Stripe public key found')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

type Action =
  | {type: 'setCustomer'; stripeCustomerId: string}
  | {type: 'updateCustomerEmail'; customerEmail: string}

type State = {
  stripeCustomerId?: string
  customerEmail?: string
  error?: string
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setCustomer':
      return {...state, stripeCustomerId: action.stripeCustomerId}
    case 'updateCustomerEmail':
      return {...state, customerEmail: action.customerEmail}
    default:
      throw new Error()
  }
}

export default function Pricing() {
  const [pricingState, dispatch] = React.useReducer(reducer, {})
  const emailInputRef = React.useRef<HTMLInputElement>(null)
  function createCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!emailInputRef.current) {
      return
    } else {
      dispatch({
        type: 'updateCustomerEmail',
        customerEmail: emailInputRef.current.value,
      })
      // TODO: check email against records
      axios
        .post(`/api/stripe/create-customer`, {
          email: emailInputRef.current.value,
        })
        .then(({data}) =>
          dispatch({type: 'setCustomer', stripeCustomerId: data.id}),
        )
    }
  }

  return (
    <Elements stripe={stripePromise}>
      {pricingState.stripeCustomerId && (
        <CheckoutForm
          stripeCustomerId={pricingState.stripeCustomerId}
          customerEmail={pricingState.customerEmail}
        />
      )}
      {!pricingState.stripeCustomerId && (
        <div>
          <form onSubmit={createCustomer}>
            <label>
              email
              <input
                ref={emailInputRef}
                type="email"
                name="email"
                id="email"
                required
              />
              <button type="submit">create account with email</button>
            </label>
          </form>
        </div>
      )}
    </Elements>
  )
}

type CheckoutFormProps = {
  stripeCustomerId?: string
  customerEmail?: string
}

const CheckoutForm: React.FunctionComponent<CheckoutFormProps> = ({
  children,
  stripeCustomerId,
  customerEmail,
}) => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: FormEvent) => {
    // Block native form submission.
    event.preventDefault()

    if (!stripe || !elements || !stripeCustomerId) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    if (!cardElement) return

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (error) {
      console.log('[error]', error)
    } else if (paymentMethod) {
      axios
        .post(`/api/stripe/create-subscription`, {
          customerId: stripeCustomerId,
          paymentMethodId: paymentMethod.id,
          // TODO: integrate prices via egghead API using SSR
          priceId: `price_1HYiOG2nImeJXwdJ7ExDNeMV`,
        })
        .then(({data}) => {
          const {
            id: subscriptionId,
            customer: customerId,
            latest_invoice,
            current_period_end: currentPeriodEnd,
            plan,
          } = data
          const {
            status: invoiceStatus,
            payment_intent: paymentIntent,
            id: invoiceId,
          } = latest_invoice
          const {status: paymentStatus} = paymentIntent
          const {id: priceId, product} = plan
          const {id: productId} = product
          // TODO: This is the egghead integration point where we need to
          // transfer this to there.
          console.log({
            customerEmail,
            subscriptionId,
            customerId,
            currentPeriodEnd,
            invoiceId,
            paymentStatus,
            invoiceStatus,
            priceId,
            productId,
          })
        })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      {children}
    </form>
  )
}
