import React, {FunctionComponent} from 'react'

type ContributorsProps = {
  contributors: {
    name: string
    type: string
    image: string
    path: string
  }[]
}
const Contributors: FunctionComponent<
  React.PropsWithChildren<ContributorsProps>
> = ({contributors}) => {
  return contributors && contributors[0].name ? (
    <div>
      <h5 className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
        Contributors
      </h5>
      <div className="text-sm mt-1">
        {contributors.map((contributor, index) => {
          const {name, type} = contributor
          const tail = index === contributors.length - 1
          const nameWithComma = type
            ? `${name} (${type})${!tail ? ', ' : ''}`
            : `${name}${!tail ? ', ' : ''}`
          return name ? (
            <span key={name} className="justify-start font-medium">
              {nameWithComma}
            </span>
          ) : null
        })}
      </div>
    </div>
  ) : null
}

export default Contributors
