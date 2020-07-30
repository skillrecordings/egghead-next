import OAuthClient from 'client-oauth2'
import {track, identify} from './analytics'
import axios from 'axios'
import get from 'lodash/get'

const http = axios.create()

const AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN
const AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID
const AUTH_REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URI

export const USER_KEY = 'egghead_sellable_user'
export const ACCESS_TOKEN_KEY = 'egghead_sellable_access_token'
export const EXPIRES_AT_KEY = 'egghead_sellable_expires_at'
export const VIEWING_AS_USER_KEY = 'egghead_sellable_viewing_as_user'

export default class Auth {
  constructor(redirectUri) {
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

  becomeUser(email, accessToken) {
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
        return user
      })
      .catch((error) => {
        this.clearLocalStorage()
      })
  }

  requestSignInEmail(email) {
    http.post(
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
    this.clearLocalStorage()
  }

  monitor(onInterval, delay = 2000) {
    if (this.isAuthenticated()) {
      return setInterval(onInterval, delay)
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
                reject(error)
              },
            )
          },
          (error) => {
            console.error(error)
            reject(error)
          },
        )
      }
    })
  }

  clearLocalStorage() {
    if (typeof localStorage === 'undefined') {
      return
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(VIEWING_AS_USER_KEY)
  }

  isAuthenticated() {
    if (typeof localStorage === 'undefined' || typeof window === 'undefined') {
      return
    }
    const expiresAt = JSON.parse(localStorage.getItem(EXPIRES_AT_KEY))
    const expired = new Date().getTime() > expiresAt
    if (expired) {
      this.clearLocalStorage()
    }
    return !expired
  }

  refreshUser(accessToken, loadFullUser = false) {
    return new Promise((resolve, reject) => {
      if (typeof localStorage === 'undefined') {
        reject('no local storage')
      }
      http
        .get(`${AUTH_DOMAIN}/api/v1/users/current?minimal=${loadFullUser}`, {
          headers: {
            Authorization: `Bearer ${
              accessToken || localStorage.getItem(ACCESS_TOKEN_KEY)
            }`,
          },
        })
        .then(({data}) => {
          localStorage.setItem(USER_KEY, JSON.stringify(data))
          resolve(data && JSON.parse(localStorage.getItem(USER_KEY)))
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  setSession(authResult) {
    if (typeof localStorage === 'undefined') {
      return
    }
    const expiresAt = JSON.stringify(
      authResult.data.expires_in * 1000 + new Date().getTime(),
    )

    localStorage.setItem(ACCESS_TOKEN_KEY, authResult.accessToken)
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt)

    return this.refreshUser(authResult.accessToken)
  }

  getAuthToken() {
    if (typeof localStorage === 'undefined') {
      return
    }
    if (this.isAuthenticated()) {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
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
      const parsedUser = JSON.parse(localStorage.getItem(USER_KEY))
      return parsedUser
    }
  }

  getUserName() {
    if (this.getLocalUser()) {
      return this.getLocalUser().name
    }
  }
}
