import isFunction from "lodash/isFunction"
import isUndefined from "lodash/isUndefined"
import get from "lodash/get"
import { USER_KEY } from "./auth"

const getLocalUser = () => {
  const user = localStorage.getItem(USER_KEY)
  if (user) {
    const parsedUser = JSON.parse(localStorage.getItem(USER_KEY))
    return parsedUser
  }
}

export const track = (event, paramsOrCallback, potentialCallback) => {
  let wasCalled = false
  let callback = potentialCallback
  const currentUser = getLocalUser() || {}
  const timeout = 1250

  const politelyExit = () => {
    if (isFunction(callback) && !wasCalled) {
      wasCalled = true
      callback.apply(null, [event, wasCalled])
    }
  }

  const params = isFunction(paramsOrCallback) ? {} : paramsOrCallback

  if (isUndefined(callback) && isFunction(paramsOrCallback)) {
    callback = paramsOrCallback
  }

  setTimeout(politelyExit, timeout)

  const userParams = { ...currentUser, ...params }

  if (get(window, "analytics.track")) {
    window.analytics.track(event, userParams, politelyExit)
  } else {
    politelyExit()
  }
}

export const identify = (user) => {
  if (get(window, "analytics.identify") && user) {
    if (user.id) {
      window.analytics.identify(user.id, {
        email: user.email,
        avatar: user.avatar_url,
        eggheadPro: user.is_pro,
        favorites: user.favorites,
      })
    } else {
      window.analytics.identify({
        email: user.email,
        avatar: user.avatar_url,
        eggheadPro: user.is_pro,
        favorites: user.favorites,
      })
    }
  }
}
