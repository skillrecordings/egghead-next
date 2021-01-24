import * as React from 'react'
import CommunityResourceIcon from './icons/community-resource-icon'

const CommunityResource: React.FunctionComponent<{type?: string}> = ({
  type = 'lesson',
}) => {
  return (
    <>
      <div className="flex items-center ">
        <CommunityResourceIcon className="w-6 mr-2 text-yellow-300 flex-shrink-0" />
        <h4 className="font-semibold">Free Community Resource</h4>
      </div>
      <div className="mt-3">
        <p className="text-sm text-gray-600">
          A Community Resource means that it’s free to access for all. The
          instructor of this lesson requested it to be open to the public.
        </p>
      </div>
    </>
  )
}

export default CommunityResource
