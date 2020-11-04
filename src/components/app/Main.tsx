import {FunctionComponent} from 'react'

const Main: FunctionComponent = ({children}) => {
  return (
    <div className="w-full sm:px-8 px-3 flex flex-col flex-grow">
      {children}
    </div>
  )
}

export default Main
