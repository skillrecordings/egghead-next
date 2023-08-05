import * as React from 'react'

const dispatchNoop: React.Dispatch<any> = (value: any) => {
  return <></>
}

export default function makeStore(
  userReducer: (state: any, action: any) => any,
  initialState: any,
  key: string,
): [
  React.FunctionComponent<React.PropsWithChildren<any>>,
  () => React.Dispatch<any>,
  () => any,
] {
  const dispatchContext = React.createContext(dispatchNoop)
  const storeContext = React.createContext(initialState)

  const reducer = (state: any, action: any) => {
    const newState = userReducer(state, action)
    return newState
  }

  const StoreProvider: React.FunctionComponent<
    React.PropsWithChildren<any>
  > = ({children}): JSX.Element => {
    const [store, dispatch] = React.useReducer(reducer, initialState)
    return (
      <>
        <dispatchContext.Provider value={dispatch}>
          <storeContext.Provider value={store}>
            {children}
          </storeContext.Provider>
        </dispatchContext.Provider>
      </>
    )
  }

  function useDispatch() {
    return React.useContext(dispatchContext)
  }

  function useStore() {
    return React.useContext(storeContext)
  }

  return [StoreProvider, useDispatch, useStore]
}
