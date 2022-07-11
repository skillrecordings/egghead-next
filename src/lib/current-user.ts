/**
 * Loads a user from the database.
 * @param token
 * @param timeout The amount of time to wait for the user to load. Needs to be
 *                short because this is used in the middleware which has a 1.5s
 *                total execution time.
 */
async function fetchEggheadUser(token: string, timeout: number = 400) {
  return new Promise(async (resolve, reject) => {
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    })

    let timedOut = false

    const id = setTimeout(() => {
      timedOut = true
      reject(`timeout loading user [${token}]`)
    }, timeout)

    const url = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/current?minimal=true`

    await fetch(url, {
      headers,
    })
      .then((response) => {
        return response.json().then((user) => {
          if (!timedOut) resolve(user)
        })
      })
      .catch((error) => {
        console.log('error fetching user', {error})
        if (!timedOut) reject(error)
        throw error
      })
      .finally(() => {
        clearTimeout(id)
      })
  })
}

export const loadUser = async (token: string, user?: any) => {
  try {
    if (user) {
      console.log('parsing the user from the cookie', user)
      user = JSON.parse(user)
      console.log('user parsed from cookie', user)
      if (user !== 'undefined') {
        return user
      }
    }
  } catch (error) {
    console.error('parse cookie stored user failed', error, user)
  }

  try {
    const user: any = await fetchEggheadUser(token).catch((error) => {
      console.error('fetch user failed', error)
      throw error
    })
    return user
  } catch (error) {
    console.error('fetch user failed', error, user)
  }
}
