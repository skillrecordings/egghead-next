import * as React from 'react'
import ImageWithPlaceholder from 'components/image-with-placeholder'

const AvatarForm: React.FC<{avatarUrl: string}> = ({avatarUrl}) => {
  return (
    <div className="flex">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full flex overflow-hidden shrink-0 border border-gray-200">
          <ImageWithPlaceholder
            src={`https:${avatarUrl}`}
            width={256}
            height={256}
            loading="eager"
          />
        </div>
        {/* Need server functionality implemented */}
        {/* <label
          htmlFor="file-upload"
          className="rounded-md border border-gray-200 bg-white py-2 px-3 leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-6 cursor-pointer duration-150"
        >
          <span>Upload avatar</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
          />
        </label> */}
      </div>
    </div>
  )
}

export default AvatarForm
