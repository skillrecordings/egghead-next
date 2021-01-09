import React from 'react'
import {Field, Form, Formik} from 'formik'

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
  onRated: (values: any) => void
}> = ({course, onRated}) => {
  const [rating, setRating] = React.useState(false)
  const [complete, setComplete] = React.useState(false)
  const {title, square_cover_480_url, slug} = course
  return (
    <>
      <div className="flex flex-col items-center">
        <img
          src={square_cover_480_url}
          alt={`illustration of ${title} course`}
          className="w-16 md:w-20 lg:w-24"
        />
        <h3 className="text-md md:text-lg lg:text-xl font-semibold mt-4 text-center white">
          {title}
        </h3>
      </div>
      {!rating && (
        <NumericRating
          course={course}
          onRated={(rating: any) => {
            setRating(rating)
          }}
        />
      )}
      {rating && !complete && (
        <TextComment
          rating={rating}
          onAnswer={(comment: any) => {
            onRated({rating, comment})
            setComplete(true)
          }}
        />
      )}
      {complete && <div>Thank you!</div>}
    </>
  )
}

const TextComment: React.FunctionComponent<{
  onAnswer: any
  rating: number | boolean
}> = ({onAnswer, rating}) => {
  const MESSAGES: any = {
    7: {
      subtitle: "We're so glad you enjoyed it! 🤗",
      title: 'What did you like about this course?',
    },
    6: {
      subtitle: 'We really appreciate your feedback.',
      title: 'What would make this course a 7 for you?',
    },
    5: {
      subtitle: 'Thanks for the feedback.',
      title: 'How will you use what you learned from this course?',
    },
    4: {
      subtitle: 'Thank you so much.',
      title: 'What was your strongest take away from this course?',
    },
    3: {
      subtitle: "We're sorry this course didn't meet your expectations",
      title: 'How can this course be improved?',
    },
    2: {
      subtitle: 'We really want to do better.',
      title:
        'Can you take a moment to let us know what you expected from this course?',
    },
    1: {
      subtitle: 'We let you down 😔',
      title: 'Do you have any constructive feedback so that we can do better?',
    },
    default: {
      subtitle: 'Thank you so much.',
      title: 'What would make this course more useful for you?',
    },
  }

  function getRating(rating: any) {
    return MESSAGES[rating] || MESSAGES.default
  }

  const {title, subtitle} = getRating(rating)

  return (
    <Formik
      initialValues={{comment: ``, answered: false}}
      onSubmit={(values: any) => {
        const comment = (values.answered && values.comment) || `other`
        onAnswer({
          comment,
          context: title,
        })
      }}
    >
      {({setValues, submitForm, values}) => {
        return (
          <Form>
            <div className="flex flex-col">
              <h2>{subtitle}</h2>
              <h3>{title}</h3>
              <Field
                className="text-gray-900 flex-1 p-2 m-1 bg-coolGray-200"
                name="comment"
                value={values.comment}
                rows={6}
                as="textarea"
                onChange={(event: {target: {value: any}}) => {
                  setValues({...values, comment: event.target.value})
                }}
              />
              <ul className="list-none">
                <li className="w-full py-2">
                  <label className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg">
                    <Field
                      type="radio"
                      name="picked"
                      value="submit"
                      className="appearance-none hidden"
                      onChange={() => {
                        setValues({...values, answered: true})
                        submitForm()
                      }}
                    />
                    Send Comments
                  </label>
                </li>
              </ul>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

const NumericRating: React.FunctionComponent<{course: any; onRated: any}> = ({
  course,
  onRated,
}) => {
  const {title, square_cover_480_url} = course
  return (
    <>
      <h3 className="text-center mt-10">
        How likely are you to recommend this course to a colleague?
      </h3>
      <Formik
        initialValues={{'rate-input': 7}}
        onSubmit={(values) => {
          console.log(values)
          const rating = values['rate-input']
          onRated(rating)
        }}
      >
        {(props) => {
          const {
            values,
            submitForm,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          } = props
          return (
            <>
              <form onSubmit={handleSubmit}>
                <div className="flex items-center space-x-4 mt-10 justify-center">
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
                <ul className="list-none mt-6">
                  <li className="w-full py-2">
                    <label className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg">
                      <Field
                        type="radio"
                        name="picked"
                        value="submit"
                        className="appearance-none hidden"
                        onChange={() => {
                          // setValues({...values, answered: true})
                          submitForm()
                        }}
                      />
                      Add Rating
                    </label>
                  </li>
                </ul>
              </form>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default RateCourseOverlay
