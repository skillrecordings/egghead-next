const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`

type CIOCustomer = {
  attributes: {
    react_score: number
  }
}

async function fetchCustomer(
  cioId: string,
  timeout: number = 400,
): Promise<CIOCustomer | null> {
  return new Promise(async (resolve, reject) => {
    const cioApiPath = `/customers/${cioId}/attributes`
    const headers = new Headers({
      Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
    })

    let timedOut = false

    // if CIO isn't responding in {timeout}s we want to fallback and show the page
    // this is because of Vercel edge function limits that require a response
    // to be returned in >=1.5s

    const id = setTimeout(() => {
      timedOut = true
      resolve(null)
    }, timeout)

    const url = `${CIO_BASE_URL}${cioApiPath}`

    await fetch(url, {
      headers,
    })
      .then((response) => {
        try {
          return response.json().then((customer: CIOCustomer) => {
            if (!timedOut) resolve(customer)
          })
        } catch (error) {
          if (!timedOut) resolve(null)
        }
      })
      .catch((error) => {
        console.log('error fetching customer', {error})
        if (!timedOut) resolve(null)
        throw error
      })
      .finally(() => {
        clearTimeout(id)
      })
  })
}

/**
 * Loads customer data from customer.io first checking if a customer is supplied
 * (via cookie) and then loading the customer async via the CIO api if not.
 *
 * Since edge functions on Vercel **require** a response within 1.5s we have a
 * safety net fallback that times out the request as some users globally have a slow
 * response here.
 *
 * Those users will have the `customer` cookie filled in later in the client side environment
 * where hard limits on response times aren't imposed.
 *
 * @see {@link https://vercel.com/docs/concepts/functions/edge-functions#maximum-execution-duration}
 *
 * @param cioId the customer.io id to load
 * @param customer optional customer object likely loaded from cookies
 * @returns customer
 */
export const loadCio = async (
  cioId: string,
  customer?: any,
): Promise<CIOCustomer | null> => {
  try {
    if (customer) {
      customer = JSON.parse(customer) as CIOCustomer
      if (customer !== 'undefined' && customer?.id === cioId) {
        return customer
      }
    }
  } catch (error) {
    console.error('parse cookie stored customer failed', error, customer)
  }

  try {
    return await fetchCustomer(cioId).catch((error) => {
      console.error('fetch customer failed', error, cioId)
      throw error
    })
  } catch (error) {
    console.error('fetch user failed', error, customer)
  }

  return null
}
