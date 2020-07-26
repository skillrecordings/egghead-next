import React from 'react'
import useEggheadUserAuthentication from '../hooks/useEggheadUserAuthentication'
import {UserContext} from './userContext'

export function EggheadUserProvider({children, loadFullUser}) {
  const userAuth = useEggheadUserAuthentication({loadFullUser})

  return (
    <UserContext.Provider value={{...userAuth}}>
      {children}
    </UserContext.Provider>
  )
}
