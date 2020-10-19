import Link from 'next/link'
import React from 'react'

const ResourceLink = ({url, title}) => {
  return (
    <div className="border border-gray-200 rounded shadow max-w-2xl mx-auto my-8">
      <div className="border-purple-500 rounded border-l-8 px-8 py-6 flex ">
        <div className="w-full">
          <p className=" text-gray-500 text-sm align-top justify-start pb-1">
            Recommended Resource
          </p>
          <a href={url}>
            <h3 className="text-xl font-medium text-purple-600 leading-normal">
              {title}
            </h3>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ResourceLink
