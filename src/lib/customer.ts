const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`

async function fetchCustomer(cioId: string, timeout: number = 400) {
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
      reject(`timeout loading customer [${cioId}]`)
    }, timeout)

    const url = `${CIO_BASE_URL}${cioApiPath}`

    await fetch(url, {
      headers,
    })
      .then((response) => {
        response.json().then(({customer}) => {
          if (!timedOut) resolve(customer)
        })
      })
      .catch((error) => {
        if (!timedOut) reject(error)
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
export const loadCio = async (cioId: string, customer?: any) => {
  try {
    if (customer) {
      customer = JSON.parse(customer)
      if (customer !== 'undefined' && customer?.id === cioId) {
        return customer
      }
    }
  } catch (error) {
    console.error(error)
  }

  try {
    const customer: any = await fetchCustomer(cioId)
    return customer?.customer ? customer.customer : customer
  } catch (error) {
    console.error(error)
  }
}
