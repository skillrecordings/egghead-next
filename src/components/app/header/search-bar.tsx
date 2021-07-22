import {track} from 'utils/analytics'
import {useRouter} from 'next/router'
import {Form, Formik} from 'formik'

const SearchBar = () => {
  const router = useRouter()
  return (
    <Formik
      initialValues={{
        query: '',
      }}
      onSubmit={(values) => {
        router.push(`/q?q=${values.query?.split(' ').join('+')}`)
        track('searched for query', {
          query: values.query,
          location: 'home',
        })
      }}
    >
      {({values, handleChange}) => {
        return (
          <Form role="search" className="w-full">
            <div className="flex items-center flex-grow space-x-2">
              <div className="relative w-full flex items-center">
                <input
                  required={true}
                  name="query"
                  value={values.query}
                  onChange={handleChange}
                  type="search"
                  placeholder={`What do you want to learn today?`}
                  className="autofill:text-fill-black form-input border border-gray-100 dark:border-gray-700 text-black dark:text-white bg-gray-50 dark:bg-gray-800 dark:placeholder-gray-300 placeholder-gray-600 text-sm rounded-md pr-1 py-2 pl-10 w-full max-w-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center group"
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
    className="text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-blue-300 transition-all ease-in-out duration-100"
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
