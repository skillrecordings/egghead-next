import React from 'react'
import {Formik} from 'formik'
import axios from 'utils/configured-axios'
import {track} from 'utils/analytics'

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
  onRated: () => void
  rateUrl: any
}> = ({course, onRated, rateUrl}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const {title, square_cover_480_url, slug} = course
  return (
    <>
      {isError && (
        <h2 className="text-center text-3xl leading-9 font-bold">
          Something went wrong!
        </h2>
      )}
      {!isSubmitted && !isError && (
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
          <Formik
            initialValues={{'rate-input': ''}}
            onSubmit={(values) => {
              const rating = values['rate-input']
              setIsSubmitted(true)
              axios
                .post(rateUrl, {rating})
                .then((response) => {
                  track('rated course', {
                    course: slug,
                    rating,
                  })
                })
                .finally(onRated)
            }}
          >
            {(props) => {
              const {
                values,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
              } = props
              return (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="flex items-center space-x-4 mt-10">
                      <div>not at all likely</div>
                      {rangeArr.map((value) => (
                        <input
                          key={`rate-input-${value}`}
                          type="radio"
                          name="rate-input"
                          id={`rate-input-${value}`}
                          value={value}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      ))}
                      <div>entirely likely</div>
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <button
                        type="submit"
                        disabled={isSubmitting || values['rate-input'] === ''}
                        className={`mt-8 transition-all duration-150 ease-in-out bg-blue-600 transform text-white font-semibold py-3 px-5 rounded-md ${
                          isSubmitting || values['rate-input'] === ''
                            ? 'opacity-50'
                            : 'hover:bg-blue-700 active:bg-blue-800 hover:scale-105 hover:shadow-xl'
                        }`}
                      >
                        Rate
                      </button>
                    </div>
                  </form>
                </>
              )
            }}
          </Formik>
        </>
      )}
    </>
  )
}

export default RateCourseOverlay
