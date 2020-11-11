import React, {FunctionComponent} from 'react'

type ContributorsProps = {
  contributors: string[]
}
const Contributors: FunctionComponent<ContributorsProps> = ({contributors}) => {
  return (
    <div className="flex content-start text-left justify-start lg:max-w-2xl mx-auto">
      <h5 className="text-gray-500 uppercase tracking-widest text-extrabold justify-start m-0 mr-6">
        Contributors
      </h5>
      <svg width="1.5rem" height="1.7rem">
        <rect width="2px" height="100%" fill="#9E70C7" />
      </svg>
      {contributors.map((contributor, index) => (
        <span key={index} className="justify-start m-0 mr-4">
          {contributor}
        </span>
      ))}
    </div>
  )
}

export default Contributors
