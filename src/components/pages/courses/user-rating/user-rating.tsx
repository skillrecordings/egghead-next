import * as React from 'react'

const UserRating: React.FunctionComponent<{
  className?: string
  rating: number
  count: number
}> = ({className, rating, count, children}) => {
  return (
    <div className={`${className ? className : ''}`}>
      {/* TODO: Stars
      <div className="flex">
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
        <StarIcon></StarIcon>
      </div> */}
    </div>
  )
}

export default UserRating
