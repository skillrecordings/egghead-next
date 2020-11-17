// import React from 'react'

// import * as yup from 'yup'
// import {Formik} from 'formik'

// const writingSchema = yup.object().shape({
//   name: yup.string().required('We need to know your name'),

//   email: yup
//     .string()
//     .email()
//     .required('We need an email address to contact you'),

//   writingLinks: yup.string().url(),

//   headline: yup
//     .string()
//     .required("Take a stab at a headline - we won't hold you to it"),

//   audience: yup.string(),
//   draft: yup.string().required('We need some idea of your main points here'),
//   relationships: yup.boolean(),
//   paypal: yup.string(),
// })

// export function WritingSubmissionForm() {
//   const [isSubmitted, setIsSubmitted] = React.useState(false)
//   const [isError, setIsError] = React.useState(false)

//   return (
//     <div className="pb-8">
//       {!isSubmitted && !isError && (
//         <Formik
//           initialValues={{
//             name: '',
//             email: '',
//             writingLinks: '',
//             headline: '',
//             audience: '',
//             draft: '',
//             relationships: '',
//             paypal: '',
//           }}
//           validationSchema={writingSchema}
//           onSubmit={(values) => {
//             console.log(values)
//           }}
//         >
//           {(props) => {
//             const {
//               values,
//               isSubmitting,
//               handleChange,
//               handleBlur,
//               handleSubmit,
//             } = props
//             return (
//               <form onSubmit={handleSubmit} className="max-w-md">
//                 {/* Name */}
//                 <div>
//                   <label
//                     for="name"
//                     className="block text-sm leading-5 font-medium text-gray-700 mb-2"
//                   >
//                     Your Name
//                   </label>
//                   <input
//                     autoFocus
//                     id="name"
//                     type="text"
//                     name="name"
//                     value={values.name}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     placeholder="Lucy Suchman"
//                     className="form-input block pl-7 pr-12 sm:text-sm sm:leading-5 p-2 mb-6 border rounded border-gray-300 bg-gray-50 w-full"
//                   ></input>
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label
//                     for="email"
//                     className="block text-sm leading-5 font-medium text-gray-700 mb-2"
//                   >
//                     Email
//                   </label>
//                   <input
//                     autoFocus
//                     id="email"
//                     type="email"
//                     name="email"
//                     value={values.email}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     placeholder="lucy@xerox.com"
//                     className="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50"
//                   ></input>
//                 </div>

//                 {/* Writing Links */}
//                 <div>
//                   <label
//                     for="writing-links"
//                     className="block text-sm leading-5 font-medium text-gray-700 mb-2"
//                   >
//                     Link to your blog or previous writing work
//                   </label>
//                   <input
//                     id="writing-links"
//                     type="text"
//                     name="writing-links"
//                     className="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50"
//                     placeholder="lucy.com/blog"
//                   ></input>
//                 </div>

//                 {/* Article Headline */}
//                 <div>
//                   <label
//                     for="headline"
//                     className="block text-sm leading-5 font-medium text-gray-700 mb-2"
//                   >
//                     Article Headline
//                   </label>
//                   <input
//                     id="headline"
//                     type="text"
//                     name="headline"
//                     className="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50"
//                     placeholder=""
//                   ></input>
//                 </div>

//                 {/* Audience */}
//                 <div>
//                   <label
//                     for="audience"
//                     className="block text-sm leading-5 font-medium text-gray-700 mb-2"
//                   >
//                     Who is the article for? What's their skill level? What will
//                     they learn by the end?
//                   </label>
//                   <textarea
//                     id="audience"
//                     type="text"
//                     name="audience"
//                     className="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50"
//                     placeholder="Intermediate React devs who will learn how to implement flexbox and grid layouts in Tailwinds CSS"
//                   ></textarea>
//                 </div>

//                 {/* Draft */}
//                 <label
//                   for="draft"
//                   className="block text-sm leading-5 font-medium text-gray-700 mb-2"
//                 >
//                   Introductory paragraph and outline of the main points (~400
//                   words)
//                 </label>
//                 <textarea
//                   id="draft"
//                   type="text"
//                   name="draft"
//                   className="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50"
//                   placeholder="Links to full article drafts also welcome"
//                 ></textarea>

//                 {/* Relationships */}
//                 <div>
//                   <label
//                     for="relationships"
//                     className="block text-sm leading-5 font-medium text-gray-700 mb-2"
//                   >
//                     Do you have professional relationships with any services,
//                     tools, or frameworks mentioned in the article? (ie. employee
//                     or developer advocate)
//                   </label>
//                   <fieldset className="mt-2 flex flex-row mb-6">
//                     <div className="mt-2 flex items-center mr-4">
//                       <input
//                         id="relationships-yes"
//                         name="relationships"
//                         type="radio"
//                         className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
//                       ></input>
//                       <label for="relationships-yes" className="ml-3">
//                         <span className="block text-sm leading-5 font-medium text-gray-700">
//                           Yes
//                         </span>
//                       </label>
//                     </div>
//                     <div className="mt-2 flex items-center">
//                       <input
//                         id="relationships-no"
//                         name="relationships"
//                         type="radio"
//                         className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
//                       ></input>
//                       <label for="relationships-no" className="ml-3">
//                         <span className="block text-sm leading-5 font-medium text-gray-700">
//                           No
//                         </span>
//                       </label>
//                     </div>
//                   </fieldset>
//                 </div>

//                 {/* Paypal */}
//                 <div>
//                   <label
//                     for="paypal"
//                     className="block text-sm leading-5 font-medium text-gray-700 mb-2"
//                   >
//                     What's your Paypal email address?
//                   </label>
//                   <input
//                     id="paypal"
//                     type="text"
//                     name="paypal"
//                     className="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5 p-2  mb-6 border rounded border-gray-300 bg-gray-50"
//                     placeholder="lucygetspaid@xerox.com"
//                   ></input>
//                 </div>

//                 {/* Submission Button */}
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="mt-6 flex items-center sm:px-5 px-3 py-2 rounded-md border-1 focus:border-blue-600 focus:outline-none bg-blue-600 border-blue-800 text-blue-100"
//                 >
//                   Pitch it
//                 </button>
//               </form>
//             )
//           }}
//         </Formik>
//       )}
//       {isSubmitted && (
//         <div className="text-text">
//           <h3>Pitch Submission Successful!</h3>
//           <p>
//             We'll get back to you within a week if we think it would be a good
//             article for egghead.
//           </p>
//         </div>
//       )}
//       {isError && (
//         <div className="text-text">
//           <p>Oh no! That didn't work 😅</p>
//           <p className="pt-3">
//             Are you using an aggressive ad blocker such as Privacy Badger?
//             Please disable it for this site and reload the page to try again.
//           </p>
//           <p className="pt-3">
//             If you <strong>aren't</strong> running aggressive adblocking please
//             check the console for errors and email support@egghead.io with any
//             info and we will help you ASAP.
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }
