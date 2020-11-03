import {FunctionComponent} from 'react'

const Main: FunctionComponent = ({children}) => {
  return (
    <main className="max-w-screen-2xl w-full mx-auto sm:px-8 px-3 flex flex-col flex-grow">
      {children}
    </main>
  )
}

export default Main
