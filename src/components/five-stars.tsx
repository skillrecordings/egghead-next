import * as React from 'react'
import {floor, map, times} from 'lodash'
import Star from './icons/star'

const FiveStars: React.FunctionComponent<{
  rating: any
}> = ({rating}) => {
  const remainder = parseFloat((rating % 1).toFixed(1))
  const roundedRemainder = Math.ceil(remainder)
  const showHalfStar = roundedRemainder === 1
  const emptyStarCount = 5 - roundedRemainder - floor(rating)
  return (
    <div className="flex items-center leading-tight">
      {map(times(rating), (index) => (
        <div key={`filled-${index}`}>
          <Star filled />
        </div>
      ))}
      {showHalfStar && (
        <div key={`half`}>
          <Star half />
        </div>
      )}
      {map(times(emptyStarCount), (index) => (
        <div key={`empty-${index}`}>
          <Star />
        </div>
      ))}
    </div>
  )
}

export default FiveStars
