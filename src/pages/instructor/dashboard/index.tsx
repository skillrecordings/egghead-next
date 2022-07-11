import * as React from 'react'
import {useViewer} from 'context/viewer-context'

const Dashboard: React.FunctionComponent<any> = () => {
  const {viewer} = useViewer()
  console.log('viewer:', viewer)
  return (
    <div className="container">
      <div>
        <h1>instructors</h1>
      </div>
    </div>
  )
}

export default Dashboard
