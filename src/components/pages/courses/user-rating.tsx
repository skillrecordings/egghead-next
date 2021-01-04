import * as React from 'react'

const UserRating: React.FunctionComponent<{
  className: string
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
      <div className="inline-flex flex-wrap items-center md:justify-start justify-center">
        {rating > 0 && (
          <>
            Rated{' '}
            <span className="ml-2 font-semibold">{rating.toFixed(1)}/5</span>
          </>
        )}
        {rating > 0 && count > 0 && ' ・ '}
        {count > 0 && (
          <>
            <span className="font-semibold mr-2">{count}</span> people completed
            this {children} course
          </>
        )}
      </div>
    </div>
  )
}

export default UserRating
