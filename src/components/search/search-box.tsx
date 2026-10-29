import React, {FunctionComponent} from 'react'
import {useSearchBox, SearchBoxProps} from 'react-instantsearch'
import useBreakpoint from '@/utils/breakpoints'
import analytics from '@/utils/analytics'
import {SearchNavigationContext} from './search-url-sync'

const CustomSearchBox: FunctionComponent<
  React.PropsWithChildren<SearchBoxProps>
> = (props) => {
  const {placeholder = 'Search for Anything'} = props
  const {query: renderedQuery, refine} = useSearchBox(props)

  const navigation = React.useContext(SearchNavigationContext)
  const query = navigation?.query ?? renderedQuery
  const navigationVersion = React.useRef<number | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const trackTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const submittedQuery = React.useRef<string | null>(null)

  const [value, setValue] = React.useState<string>(query)

  const cancelTimers = React.useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current)
    if (trackTimer.current !== null) clearTimeout(trackTimer.current)
    timer.current = null
    trackTimer.current = null
  }, [])

  React.useEffect(() => cancelTimers, [cancelTimers])

  React.useEffect(() => {
    if (query === submittedQuery.current) {
      submittedQuery.current = null
      return
    }
    submittedQuery.current = null
    cancelTimers()
    setValue(query)
  }, [query, cancelTimers])

  React.useEffect(() => {
    if (!navigation || navigation.version === navigationVersion.current) return
    navigationVersion.current = navigation.version
    cancelTimers()
    submittedQuery.current = null
    setValue(navigation.query)
  }, [navigation, cancelTimers])

  const {sm} = useBreakpoint()

  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const onChangeDebounced = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    cancelTimers()

    timer.current = setTimeout(() => {
      timer.current = null
      submittedQuery.current = value
      refine(value)
    }, 450)

    trackTimer.current = setTimeout(() => {
      trackTimer.current = null
      analytics.events.engagementSearchedWithQuery('search page', value)
    }, 1500)

    setValue(value)
  }
  return (
    <form
      noValidate
      action=""
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="w-full relative "
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {/* prettier-ignore */}
          <svg className="text-gray-500" width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
        </div>
        <input
          type="search"
          value={value}
          onChange={onChangeDebounced}
          placeholder={mounted ? (sm ? 'Search' : placeholder) : 'Search'}
          className="pl-10 dark:hover:bg-gray-800 hover:bg-opacity-60 transition text-black dark:text-white dark:bg-gray-900 bg-white border-transparent px-5 py-3 sm:text-sm text-xs w-full focus:ring-1 ring-blue-400 placeholder-gray-600 dark:placeholder-gray-300"
        />
      </div>
    </form>
  )
}

export default CustomSearchBox
