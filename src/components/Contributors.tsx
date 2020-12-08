import React, {FunctionComponent} from 'react'

type ContributorsProps = {
  contributors: string[]
}
const Contributors: FunctionComponent<ContributorsProps> = ({contributors}) => {
  return (
    <div className="">
      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
        Contributors
      </div>
      <div>
        {contributors.map((contributor, index) => (
          <span key={contributor} className="justify-start">
            {contributor}
            {index !== contributors.length - 1 && ', '}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Contributors
