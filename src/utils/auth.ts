import OAuthClient from 'client-oauth2'
import {track, identify} from './analytics'
import axios from 'axios'
import get from 'lodash/get'
import cookie from './cookies'
import * as serverCookie from 'cookie'
import getAccessTokenFromCookie from './get-access-token-from-cookie'
import {CIO_KEY} from '../hooks/use-cio'
import {
  ACCESS_TOKEN_KEY as CONFIG_ACCESS_TOKEN,
  EGGHEAD_USER_COOKIE_KEY,
} from '../config'

const http = axios.create()

export const ACCESS_TOKEN_KEY = CONFIG_ACCESS_TOKEN
export const AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN
const AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID
const AUTH_REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URI

export const USER_KEY = 'eh_user_2020_11_22'
export const EXPIRES_AT_KEY = 'eh_token_expiration'
export const VIEWING_AS_USER_KEY = 'eh_viewing_as_user_2020_11_22'

type AuthorizationHeader = {
  Authorization: string
}

export const getAuthorizationHeader = () => {
  const token = getAccessTokenFromCookie()
  const authorizationHeader: AuthorizationHeader = token && {
    Authorization: `Bearer ${token}`,
  }

  return authorizationHeader
}

export function getTokenFromCookieHeaders(serverCookies = '') {
  const parsedCookie = serverCookie.parse(serverCookies)
  const eggheadToken = parsedCookie[ACCESS_TOKEN_KEY] || ''
  return {eggheadToken, loginRequired: eggheadToken.length <= 0}
}

const SIXTY_DAYS_IN_SECONDS = JSON.stringify(60 * 24 * 60 * 60)

export default class Auth {
  eggheadAuth: OAuthClient

  constructor(redirectUri?: string) {
    this.eggheadAuth = new OAuthClient({
      clientId: AUTH_CLIENT_ID,
      authorizationUri: `${AUTH_DOMAIN}/oauth/authorize`,
      accessTokenUri: `${AUTH_DOMAIN}/oauth/token`,
      redirectUri: redirectUri || AUTH_REDIRECT_URL,
    })
    this.requestSignInEmail = this.requestSignInEmail.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.handleAccessTokenAuthentication =
      this.handleAccessTokenAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.refreshUser = this.refreshUser.bind(this)
    this.monitor = this.monitor.bind(this)
  }

  becomeUser(email: any, accessToken: any) {
    if (typeof localStorage === 'undefined') {
      return
    }

    accessToken = accessToken ?? getAccessTokenFromCookie()

    return http
      .post(
        `${AUTH_DOMAIN}/api/v1/users/become_user?email=${email}&client_id=${AUTH_CLIENT_ID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then(({data}) => {
        const expiresAt = JSON.stringify(
          data.access_token.expires_in * 1000 + new Date().getTime(),
        )
        const user = data.user

        localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token.token)
        localStorage.setItem(EXPIRES_AT_KEY, expiresAt)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        localStorage.setItem(VIEWING_AS_USER_KEY, get(user, 'email'))

        if (user.contact_id) {
          cookie.set(CIO_KEY, user.contact_id)
        }

        cookie.set(ACCESS_TOKEN_KEY, data.access_token.token, {
          expires: parseInt(expiresAt, 10),
          domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
        })
        return user
      })
      .catch((error) => {
        this.logout()
      })
  }

  requestSignInEmail(email: string) {
    return http.post(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/send_token`,
      {
        email,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        redirect_uri: AUTH_REDIRECT_URL,
      },
    )
  }

  login() {
    window.open(this.eggheadAuth.token.getUri())
    track('logged in')
  }

  logout() {
    return new Promise((resolve) => {
      track('logged out')
      resolve(this.clearLocalStorage())
    })
  }

  monitor(onInterval: {(): void; (...args: any[]): void}, delay = 2000) {
    if (this.isAuthenticated()) {
      return window.setInterval(onInterval, delay)
    }
  }

  handleAccessTokenAuthentication(
    accessToken: string,
    expiresInSeconds: string = SIXTY_DAYS_IN_SECONDS,
  ) {
    // handle any previous location redirects here

    return this.handleNewSession(accessToken, expiresInSeconds).catch((e) => {
      if (e.isAxiosError && e.response.status === 403) {
        // do nothing, logout has been called to clear local session data
      } else {
        return Promise.reject(e)
      }
    })
  }

  handleNewSession(accessToken: string, expiresInSeconds: string) {
    return new Promise((resolve, reject) => {
      this.setSession(accessToken, expiresInSeconds).then(
        (user: any) => {
          identify(user)
          resolve(user)
        },
        (error) => {
          console.error(error)
          this.logout().then(() => reject(error))
        },
      )
    })
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      if (typeof localStorage === 'undefined') {
        reject('no localstorage')
      }
      if (typeof window !== 'undefined') {
        const uri = window.location.href
        window.history.pushState(
          '',
          document.title,
          window.location.pathname + window.location.search,
        )
        this.eggheadAuth.token.getToken(uri).then(
          (authResult) => {
            const user = this.handleNewSession(
              authResult.accessToken,
              authResult.data.expires_in,
            )
            resolve(user)
          },
          (error) => {
            console.error(error)
            this.logout().then(() => reject(error))
          },
        )
      }
    })
  }

  clearLocalStorage() {
    return new Promise((resolve, reject) => {
      const removeLocalStorage = () => {
        cookie.remove(ACCESS_TOKEN_KEY, {
          domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
        })

        cookie.remove(EGGHEAD_USER_COOKIE_KEY, {
          domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
        })

        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          localStorage.removeItem(EXPIRES_AT_KEY)
          localStorage.removeItem(USER_KEY)
          localStorage.removeItem(VIEWING_AS_USER_KEY)
        }

        return resolve(true)
      }

      return removeLocalStorage()
    })
  }

  isAuthenticated() {
    if (typeof localStorage === 'undefined' || typeof window === 'undefined') {
      return
    }
    const storedExpiration = localStorage.getItem(EXPIRES_AT_KEY) || '0'
    const expiresAt = JSON.parse(storedExpiration)
    const expired = new Date().getTime() > expiresAt
    if (expiresAt > 0 && expired) {
      this.logout()
    }
    return !expired
  }

  refreshUser(minimalUser = true) {
    return new Promise((resolve, reject) => {
      if (typeof localStorage === 'undefined') {
        reject('no local storage')
      }

      http
        .get(`/api/users/current?minimal=${minimalUser}`, {})
        .then(({data}) => {
          if (!this.isAuthenticated()) {
            return reject('not authenticated')
          }
          if (data) identify(data)
          if (data.contact_id) {
            cookie.set(CIO_KEY, data.contact_id)
          }
          localStorage.setItem(USER_KEY, JSON.stringify(data))
          cookie.set(EGGHEAD_USER_COOKIE_KEY, JSON.stringify(data), {
            domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
          })
          resolve(data)
        })
        .catch((error) => {
          this.logout().then(() => reject(error))
        })
    })
  }

  setSession(accessToken: string, expiresInSeconds: string) {
    return new Promise((resolve, reject) => {
      if (typeof localStorage === 'undefined') {
        reject('localStorage is not defined')
      }

      const now: number = new Date().getTime()

      const millisecondsInASecond = 1000
      const expiresAt = Number(expiresInSeconds) * millisecondsInASecond + now

      const millisecondsInADay = 60 * 60 * 24 * 1000
      const expiresInDays = Math.floor((expiresAt - now) / millisecondsInADay)

      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(EXPIRES_AT_KEY, JSON.stringify(expiresAt))
      cookie.set(ACCESS_TOKEN_KEY, accessToken, {
        expires: expiresInDays,
        domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
      })
      resolve(this.refreshUser())
    })
  }

  getAuthToken() {
    if (typeof localStorage === 'undefined') {
      return
    }
    if (this.isAuthenticated()) {
      return cookie.get(ACCESS_TOKEN_KEY)
    }
  }

  getUser() {
    return this.getLocalUser()
  }

  getLocalUser() {
    if (typeof localStorage === 'undefined') {
      return
    }
    const user = localStorage.getItem(USER_KEY)
    if (user) {
      const parsedUser = JSON.parse(user)
      return parsedUser
    }
  }

  getUserName() {
    if (this.getLocalUser()) {
      return this.getLocalUser().name
    }
  }
}
