import * as React from 'react'
import CommunityResourceIcon from './icons/community-resource-icon'

const ScrimbaResource: React.FunctionComponent<{type?: string}> = ({
  type = 'lesson',
}) => {
  return (
    <>
      <div className="flex items-baseline">
        <CommunityResourceIcon className="w-6 mr-2 text-yellow-300 flex-shrink-0 justify-center" />
        <h4 className="text-xl font-semibold mb-4">Scrimba Resource</h4>
      </div>
      <p className="prose dark:prose-dark w-full">
        This is a Scrimba Course Resource. It will bring extra interactivity to
        the course. This is also a free resource.
      </p>
    </>
  )
}

export default ScrimbaResource
