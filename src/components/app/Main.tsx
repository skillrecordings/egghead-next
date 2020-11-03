import {FunctionComponent} from 'react'

const Main: FunctionComponent = ({children}) => {
  return (
    <main className="w-full sm:px-8 px-3 flex flex-col flex-grow">
      {children}
    </main>
  )
}

export default Main
