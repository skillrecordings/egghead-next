import React from 'react'

import * as yup from 'yup'
import {Formik} from 'formik'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

export function WritingSubmissionForm() {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState(false)

  return (
    <div className=" pb-8 px-4 sm:px-8">
      {!isSubmitted && !isError && (
        <Formik
          initialValues={{email: ''}}
          validationSchema={loginSchema}
          onSubmit={(values) => {
            requestSignInEmail(values.email)
              .then(() => {
                setIsSubmitted(true)
              })
              .catch(() => {
                setIsError(true)
              })
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
                  <div>
                    <label
                      htmlFor="email"
                      className="block leading-6 text-gray-800"
                    >
                      Email address
                    </label>
                    <div className="mt-1 rounded-md shadow-sm">
                      <input
                        autoFocus
                        id="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="you@company.com"
                        required
                        className="bg-gray-200 focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-full mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className=" transition duration-150 ease-in-out bg-gray-900 hover:bg-gray-700 hover:shadow-xl text-white font-semibold py-3 px-5 rounded"
                    >
                      Email a login link
                    </button>
                  </div>
                </form>
              </>
            )
          }}
        </Formik>
      )}
      {isSubmitted && (
        <div className="text-text">
          <h3>Pitch Submission Successful!</h3>
          <p>
            We'll get back to you within a week if we think it would be a good
            article for egghead.
          </p>
        </div>
      )}
      {isError && (
        <div className="text-text">
          <p>Login Link Not Sent 😅</p>
          <p className="pt-3">
            Are you using an aggressive ad blocker such as Privacy Badger?
            Please disable it for this site and reload the page to try again.
          </p>
          <p className="pt-3">
            If you <strong>aren't</strong> running aggressive adblocking please
            check the console for errors and email support@egghead.io with any
            info and we will help you ASAP.
          </p>
        </div>
      )}
    </div>
  )
}

//   <form className="max-w-md">
//   <label for="name" class="block text-sm leading-5 font-medium text-gray-700 mb-2">Full Name</label>
//   <input
//     id="name"
//     type="text"
//     name="name"
//     class="form-input block pl-7 pr-12 sm:text-sm sm:leading-5 p-2 mb-6 border rounded border-gray-300 bg-gray-50 w-full" placeholder="Lucy Suchman"
//   ></input>
//   <label for="email" class="block text-sm leading-5 font-medium text-gray-700 mb-2">Email</label>
//   <input
//     id="email"
//     type="text"
//     name="email"
//     class="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50" placeholder="lucy@xerox.com"
//   ></input>
//   <label for="writing-links" class="block text-sm leading-5 font-medium text-gray-700 mb-2">Link to your blog or previous writing work</label>
//   <input
//     id="writing-links"
//     type="text"
//     name="writing-links"
//     class="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50" placeholder="lucy.com/blog"
//   ></input>
//   <label for="headline" class="block text-sm leading-5 font-medium text-gray-700 mb-2">Article Headline</label>
//   <input
//     id="headline"
//     type="text"
//     name="headline"
//     class="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50" placeholder=""
//   ></input>
//   <label for="audience" class="block text-sm leading-5 font-medium text-gray-700 mb-2">Who is the article for? What's their skill level? What will they learn by the end?</label>
//   <textarea
//     id="audience"
//     type="text"
//     name="audience"
//     class="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50" placeholder="Intermediate React devs who will learn how to implement flexbox and grid layouts in Tailwinds CSS"
//   ></textarea>
//   <label for="draft" class="block text-sm leading-5 font-medium text-gray-700 mb-2">Introductory paragraph and outline of the main points (~400 words)</label>
//   <textarea
//     id="draft"
//     type="text"
//     name="draft"
//     class="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50" placeholder="Links to full article drafts also welcome"
//   ></textarea>

// <label
//   for="relationships"
//   class="block text-sm leading-5 font-medium text-gray-700 mb-2"
// >
//   Do you have professional relationships with any services, tools, or frameworks
//   mentioned in the article? (ie. employee or developer advocate)
// </label>
// <fieldset class="mt-2 flex flex-row mb-6">
//   <div class="mt-2 flex items-center mr-4">
//     <input
//       id="relationships-yes"
//       name="relationships"
//       type="radio"
//       class="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
//     ></input>
//     <label for="relationships-yes" class="ml-3">
//       <span class="block text-sm leading-5 font-medium text-gray-700">Yes</span>
//     </label>
//   </div>
//   <div class="mt-2 flex items-center">
//     <input
//       id="relationships-no"
//       name="relationships"
//       type="radio"
//       class="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
//     ></input>
//     <label for="relationships-no" class="ml-3">
//       <span class="block text-sm leading-5 font-medium text-gray-700">No</span>
//     </label>
//   </div>
// </fieldset>

// <label
//   for="paypal"
//   class="block text-sm leading-5 font-medium text-gray-700 mb-2"
// >
//   What's your Paypal email address?
// </label>
// <input
//   id="paypal"
//   type="text"
//   name="paypal"
//   class="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50"
//   placeholder="lucygetspaid@xerox.com"
// ></input>

// </form>

// <button className="mt-6 flex items-center sm:px-5 px-3 py-2 rounded-md border-1 focus:border-blue-600 focus:outline-none bg-blue-600 border-blue-800 text-blue-100">
//   Pitch it
// </button>
