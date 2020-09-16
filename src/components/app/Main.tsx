import {FunctionComponent} from 'react'

const Main: FunctionComponent = ({children}) => {
  return (
    <main className="max-w-screen-ultra w-full mx-auto sm:p-8 p-5 flex flex-col flex-grow">
      {children}
    </main>
  )
}

export default Main
