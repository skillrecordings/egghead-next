import * as React from 'react'
import {Field, Form, Formik} from 'formik'
import OverlayWrapper from 'components/pages/lessons/overlay/wrapper'

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

const RateCourseOverlay: React.FunctionComponent<
  React.PropsWithChildren<{
    course: any
    onRated: (values: any) => void
  }>
> = ({course, onRated}) => {
  const [rating, setRating] = React.useState(false)
  const [complete, setComplete] = React.useState(false)
  const {title, square_cover_480_url, slug} = course

  return (
    <OverlayWrapper>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <img
            src={square_cover_480_url}
            alt={`illustration of ${title} course`}
            className="w-16 md:w-24"
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
      </div>
    </OverlayWrapper>
  )
}

const TextComment: React.FunctionComponent<
  React.PropsWithChildren<{
    onAnswer: any
    rating: number | boolean
  }>
> = ({onAnswer, rating}) => {
  const MESSAGES: any = {
    7: {
      subtitle: "We're so glad you enjoyed it! 🤗",
      title: 'What did you like about this course?',
    },
    6: {
      subtitle: 'We really appreciate your feedback.',
      title: 'What did you like about this course?',
    },
    5: {
      subtitle: 'Thanks for the feedback.',
      title: 'What did you like about this course?',
    },
    4: {
      subtitle: 'Thank you so much.',
      title: 'What did you like about this course?',
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
        const comment = values.answered && values.comment
        onAnswer({
          comment,
          context: {prompt: title},
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

const NumericRating: React.FunctionComponent<
  React.PropsWithChildren<{course: any; onRated: any}>
> = ({course, onRated}) => {
  const {title, square_cover_480_url} = course
  return (
    <>
      <h3 className="text-center mt-4 md:mt-6">
        How likely are you to recommend this course to a colleague?
      </h3>
      <Formik
        initialValues={{'rate-input': 7}}
        onSubmit={(values) => {
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
                <div className="flex items-center space-x-4 mt-4 sm:mt-6 md:mt-8 justify-center">
                  <div>
                    <span className="hidden sm:block">not at all likely</span>
                    <IconThumbDown className="w-8 sm:hidden" />
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
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
                  </div>
                  <div>
                    <span className="hidden sm:block">entirely likely</span>
                    <IconThumbUp className="w-8 sm:hidden" />
                  </div>
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

const IconThumbDown: React.FunctionComponent<
  React.PropsWithChildren<{className?: string}>
> = ({className = ''}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
    ></path>
  </svg>
)

const IconThumbUp: React.FunctionComponent<
  React.PropsWithChildren<{className?: string}>
> = ({className = ''}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
    ></path>
  </svg>
)
