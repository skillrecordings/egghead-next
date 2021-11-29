const CIO_BASE_URL = `https://beta-api.customer.io/v1/api/`

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
    const cioApiPath = `/customers/${cioId}/attributes`
    const headers = new Headers({
      Authorization: `Bearer ${process.env.CUSTOMER_IO_APPLICATION_API_KEY}`,
    })

    const {customer} = await fetch(`${CIO_BASE_URL}${cioApiPath}`, {
      headers,
    }).then((response) => {
      return response.json()
    })
    return customer
  } catch (error) {
    console.log(error)
  }
}
