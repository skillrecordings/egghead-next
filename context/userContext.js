import React from "react"
const noop = () => {}
export const UserContext = React.createContext({
  authenticated: false,
  user: {},
  notification: null,
  setNotification: noop,
  clearNotification: noop,
})
