import {track} from 'utils/analytics'
import {useRouter} from 'next/router'
import {Form, Formik} from 'formik'
import {isEmpty} from 'lodash'

const SearchBar = () => {
  const router = useRouter()
  return (
    <Formik
      initialValues={{
        query: '',
      }}
      onSubmit={(values) => {
        if (isEmpty(values.query)) {
          router.push(`/q`)
          track('clicked search icon with no query', {
            location: 'home',
          })
        } else {
          router.push(`/q?q=${values.query?.split(' ').join('+')}`)
          track('searched for query', {
            query: values.query,
            location: 'home',
          })
        }
      }}
    >
      {({values, handleChange}) => {
        return (
          <Form role="search" className="w-full">
            <div className="flex items-center flex-grow">
              <div className="relative w-full flex items-stretch h-9">
                <input
                  name="query"
                  value={values.query}
                  onChange={handleChange}
                  type="search"
                  placeholder={`What do you want to learn today?`}
                  className="autofill:text-fill-black form-input border border-gray-200 dark:border-gray-700 text-black dark:text-white bg-gray-50 dark:bg-gray-700 dark:placeholder-gray-300 placeholder-gray-600 text-sm rounded-l-md rounded-r-none px-3 py-2 w-full max-w-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 relative focus:z-10"
                />
                <button
                  type="submit"
                  className="flex items-center group p-2 rounded-r-md rounded-l-0 border border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-800 bg-gray-100 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-800 duration-100 -translate-x-px"
                >
                  <IconMagnifier />
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default SearchBar

const IconMagnifier = () => (
  <svg
    aria-hidden="true"
    className="text-gray-500 group-hover:text-gray-700 dark:text-white dark:group-hover:text-white transition-all ease-in-out duration-100"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)
