import {FunctionComponent} from 'react'

const Main: FunctionComponent = ({children}) => {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-8 flex flex-col flex-grow">
      {children}
    </div>
  )
}

export default Main
