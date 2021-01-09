import LogRocket from 'logrocket'
import * as React from 'react'

export const logRocketIdentify = (id: string, options?: any) => {
  console.log({id, options})
  if (id) {
    LogRocket.identify(id, {
      ...(!!options && options),
    })
  }
}

export const LogRocketContext = React.createContext({
  LogRocket,
  logRocketIdentify,
  isIdentified: false,
  setIsIdentified: (identified: boolean) => {},
  initialized: false,
})

export const LogRocketProvider: React.FunctionComponent = ({children}) => {
  const [isIdentified, setIsIdentified] = React.useState(false)
  const [initialized, setInitialized] = React.useState(false)
  React.useEffect(() => {
    LogRocket.init('9oatww/egghead-next')
    setInitialized(true)
  }, [])
  return (
    <LogRocketContext.Provider
      value={{
        LogRocket,
        logRocketIdentify,
        isIdentified,
        setIsIdentified,
        initialized,
      }}
    >
      {children}
    </LogRocketContext.Provider>
  )
}

export default function useLogRocket(viewer?: any) {
  const logRocketContext = React.useContext(LogRocketContext)
  if (
    logRocketContext.initialized &&
    viewer?.contact_id &&
    !logRocketContext.isIdentified
  ) {
    const {contact_id, email, name, ...rest} = viewer
    logRocketIdentify(contact_id, {
      email,
      name,
    })
    logRocketContext.setIsIdentified(true)
  }
  return
}
