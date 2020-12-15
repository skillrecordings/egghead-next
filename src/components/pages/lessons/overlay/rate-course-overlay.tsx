import React from 'react'
import {Formik} from 'formik'

const rangeArr = [1, 2, 3, 4, 5, 6, 7]

const rangeArrMobile = [
  'Not at all likely',
  'Very unlikely',
  'Somewhat unlikely',
  'Neutral',
  'Somewhat likely',
  'Very likely',
  'Entirely likely',
]

const RateCourseOverlay: React.FunctionComponent<{
  course: any
  send: any
}> = ({course, send}) => {
  const {title, square_cover_480_url} = course
  return (
    <>
      <div className="flex flex-col items-center">
        <img
          src={square_cover_480_url}
          alt={`illustration of ${course.title} course`}
          className="w-16 md:w-20 lg:w-24"
        />
        <h3 className="text-md md:text-lg lg:text-xl font-semibold mt-4 text-center white">
          {title}
        </h3>
      </div>
      <h3 className="text-center mt-10">
        How likely are you to recommend this course to a colleague?
      </h3>
      <div className="flex items-center space-x-4 mt-10">
        <div>not at all likely</div>
        {rangeArr.map((item, index) => (
          <button
            className="block w-10 h-10 text-white hover:text-black border border-white bg-black hover:bg-white rounded-full"
            key={`rating-select-${index}`}
            onClick={() => console.log(item)}
          >
            {item}
          </button>
        ))}
        <div>entirely likely</div>
      </div>
    </>
  )
}

export default RateCourseOverlay
