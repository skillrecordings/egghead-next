import OAuthClient from 'client-oauth2'
import {track, identify} from './analytics'
import axios from 'axios'
import get from 'lodash/get'
import cookie from './cookies'
import * as serverCookie from 'cookie'

const http = axios.create()

export const AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN
const AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID
const AUTH_REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URI

export const USER_KEY = 'eh_user_2020_11_22'
export const ACCESS_TOKEN_KEY = 'eh_token_2020_11_22'
export const EXPIRES_AT_KEY = 'eh_token_expiration'
export const VIEWING_AS_USER_KEY = 'eh_viewing_as_user_2020_11_22'

export function getTokenFromCookieHeaders(serverCookies = '') {
  const parsedCookie = serverCookie.parse(serverCookies)
  const eggheadToken = parsedCookie[ACCESS_TOKEN_KEY] || ''
  return {eggheadToken, loginRequired: eggheadToken.length <= 0}
}

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
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.refreshUser = this.refreshUser.bind(this)
    this.monitor = this.monitor.bind(this)
  }

  becomeUser(email: any, accessToken: any) {
    if (typeof localStorage === 'undefined') {
      return
    }
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
      },
    )
  }

  login() {
    window.open(this.eggheadAuth.token.getUri())
    track('logged in')
  }

  logout() {
    track('logged out')
    return this.clearLocalStorage()
  }

  monitor(onInterval: {(): void; (...args: any[]): void}, delay = 2000) {
    if (this.isAuthenticated()) {
      return window.setInterval(onInterval, delay)
    }
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      if (typeof localStorage === 'undefined') {
        reject('no localstorage')
      }
      if (typeof window !== 'undefined') {
        this.eggheadAuth.token.getToken(window.location).then(
          (user) => {
            this.setSession(user).then(
              () => {
                identify(user)
                track('authentication success')
                window.history.pushState(
                  '',
                  document.title,
                  window.location.pathname + window.location.search,
                )
                resolve(user)
              },
              (error) => {
                console.error(error)
                this.logout()
                reject(error)
              },
            )
          },
          (error) => {
            console.error(error)
            this.logout()
            reject(error)
          },
        )
      }
    })
  }

  clearLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(EXPIRES_AT_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(VIEWING_AS_USER_KEY)
    }

    return axios
      .delete(`/api/users/session`)
      .catch((error) => console.error(error))
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

  refreshUser(
    accessToken: string | string[] | null | undefined,
    loadFullUser = false,
  ) {
    return new Promise((resolve, reject) => {
      if (typeof localStorage === 'undefined') {
        reject('no local storage')
      }
      http
        .get(`/api/users/current?minimal=${loadFullUser}`, {})
        .then(({data}) => {
          localStorage.setItem(USER_KEY, JSON.stringify(data))
          resolve(data)
        })
        .catch((error) => {
          this.logout()
          reject(error)
        })
    })
  }

  setSession(authResult: OAuthClient.Token) {
    return new Promise((resolve, reject) => {
      if (typeof localStorage === 'undefined') {
        reject('localStorage is not defined')
      }
      const expires: unknown = authResult.data.expires_in
      const expiresAt = JSON.stringify(
        (expires as number) * 1000 + new Date().getTime(),
      )
      const now: number = new Date().getTime()

      const expiresInDays = Math.floor(
        (Number(expiresAt) - now) / (60 * 60 * 24 * 1000),
      )

      console.log(expiresInDays)

      localStorage.setItem(ACCESS_TOKEN_KEY, authResult.accessToken)
      localStorage.setItem(EXPIRES_AT_KEY, expiresAt)
      cookie.set(ACCESS_TOKEN_KEY, authResult.accessToken, {
        expires: expiresInDays,
        domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
      })
      resolve(this.refreshUser(authResult.accessToken))
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
