import {track} from 'utils/analytics'
import {useRouter} from 'next/router'
import {Form, Formik} from 'formik'
import {isEmpty} from 'lodash'
import analytics from 'utils/analytics'
import {twMerge} from 'tailwind-merge'

const SearchBar = ({
  initialValue = '',
  className = '',
}: {
  initialValue?: string
  className?: string
}) => {
  const router = useRouter()
  return (
    <Formik
      initialValues={{
        query: initialValue,
      }}
      onSubmit={(values) => {
        if (isEmpty(values.query)) {
          router.push(`/q`)
          track('clicked search icon with no query', {
            location: 'home',
          })
        } else {
          router.push(`/q?q=${values.query?.split(' ').join('+')}`)
          analytics.events.engagementSearchedWithQuery(
            'home page',
            values.query,
          )
        }
      }}
    >
      {({values, handleChange}) => {
        return (
          <Form
            role="search"
            className={twMerge(
              'sm:border-r dark:border-white border-gray-900 dark:border-opacity-5 border-opacity-5 sm:w-auto',
              className,
            )}
          >
            <div className="relative flex dark:hover:border-white dark:focus-within:border-white hover:border-gray-900 focus-within:border-gray-900 border-b border-transparent pl-2 hover:border-opacity-30 focus-within:border-opacity-30 dark:hover:border-opacity-30 dark:focus-within:border-opacity-30 justify-between">
              <input
                name="query"
                value={values.query}
                onChange={handleChange}
                type="search"
                aria-label="Search"
                placeholder="Search for Anything"
                autoComplete="off"
                className="dark:placeholder-opacity-60 placeholder-opacity-60 dark:placeholder-white placeholder-black bg-transparent sm:text-sm text-base sm:w-[230px] w-full h-12 focus:ring-0 border-none p-0 xl:text-md"
              />
              <button
                type="submit"
                className="p-3 flex items-center dark:hover:bg-white hover:bg-gray-50 dark:hover:bg-opacity-5"
              >
                <IconMagnifier />
                <span className="sr-only">Search</span>
              </button>
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
    className=""
    width="18"
    height="18"
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
