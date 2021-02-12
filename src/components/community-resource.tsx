import * as React from 'react'
import CommunityResourceIcon from './icons/community-resource-icon'

const CommunityResource: React.FunctionComponent<{type?: string}> = ({
  type = 'lesson',
}) => {
  return (
    <>
      <div className="flex items-baseline">
        <CommunityResourceIcon className="w-6 mr-2 text-yellow-300 flex-shrink-0 justify-center" />
        <h4 className="text-xl font-semibold mb-4">Free Community Resource</h4>
      </div>
      <p className="prose dark:prose-dark w-full">
        A Community Resource means that it’s free to access for all. The
        instructor of this lesson requested it to be open to the public.
      </p>
    </>
  )
}

export default CommunityResource
