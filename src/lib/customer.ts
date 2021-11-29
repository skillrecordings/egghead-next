const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`

async function fetchCustomer(cioId: string) {
  return new Promise(async (resolve, reject) => {
    const cioApiPath = `/customers/${cioId}/attributes`
    const headers = new Headers({
      Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
    })

    // if CIO isn't responding in 4s we want to fallback and show the page
    const TIMEOUT = 4000

    const id = setTimeout(() => {
      reject(`timeout loading customer [${cioId}]`)
    }, TIMEOUT)

    const url = `${CIO_BASE_URL}${cioApiPath}`

    const {customer} = await fetch(url, {
      headers,
    })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        reject(error)
      })
      .finally(() => {
        clearTimeout(id)
      })
    resolve(customer)
  })
}

export const loadCio = async (cioId: string, customer?: any) => {
  try {
    if (customer) {
      customer = JSON.parse(customer)
      if (customer !== 'undefined' && customer?.id === cioId) {
        return customer
      }
    }
  } catch (error) {
    console.log(error)
  }

  try {
    return await fetchCustomer(cioId)
  } catch (error) {
    console.error(error)
  }
}
