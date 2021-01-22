import LogRocket from 'logrocket'
import * as React from 'react'
import {Viewer} from '../types'
import {useViewer} from '../context/viewer-context'

export const logRocketIdentify = (id: string, options?: any) => {
  if (id) {
    LogRocket.identify(id, {
      ...(!!options && options),
    })
  }
}

type LogRocket = {
  LogRocket: any
  identified: Viewer | boolean
  identifyViewer: (viewer: Viewer) => void
  initialized: boolean
  setEnabled: (enabled: boolean) => void
}

export const LogRocketContext = React.createContext<LogRocket>({
  LogRocket,
  identified: false,
  identifyViewer: (viewer: Viewer) => {},
  initialized: false,
  setEnabled: (enabled: boolean) => {},
})

export const LogRocketProvider: React.FunctionComponent = ({children}) => {
  const [identified, setIdentified] = React.useState<Viewer | boolean>(false)
  const [initialized, setInitialized] = React.useState(false)
  const [enabled, setEnabled] = React.useState(false)
  const {viewer} = useViewer()
  const isPro = viewer?.is_pro === true

  React.useEffect(() => {
    if (isPro) {
      setEnabled(true)
    }
  }, [isPro])

  const initialize = React.useCallback(() => {
    if (enabled) {
      console.debug(`initializing log rocket`)
      LogRocket.init('9oatww/egghead-next')
      setInitialized(true)
    }
  }, [enabled])

  const identifyViewer = (viewer: Viewer) => {
    const {contact_id, ...rest} = viewer
    if (!initialized) {
      initialize()
    }
    if (enabled && initialized) {
      logRocketIdentify(contact_id, {
        ...rest,
      })
      setIdentified(viewer)
    }
  }

  React.useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <LogRocketContext.Provider
      value={{
        LogRocket,
        identified,
        identifyViewer,
        initialized,
        setEnabled,
      }}
    >
      {children}
    </LogRocketContext.Provider>
  )
}

export default function useLogRocket({viewer}: {viewer: any}) {
  const logRocketContext = React.useContext(LogRocketContext)

  if (viewer) {
    logRocketContext.identifyViewer(viewer)
  }

  return logRocketContext
}
