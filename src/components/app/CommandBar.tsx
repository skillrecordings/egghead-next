import {FunctionComponent} from 'react'

const CommandBar: FunctionComponent = () => {
  return (
    <div className="mt-8 w-full flex items-center justify-between">
      {/* TODO: Map commands */}
      <input type="text" placeholder="Enter a dev command" />
    </div>
  )
}

export default CommandBar
