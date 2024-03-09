import React, {FunctionComponent} from 'react'
import {useSearchBox, SearchBoxProps} from 'react-instantsearch'
import {track} from '@/utils/analytics'
import useBreakpoint from '@/utils/breakpoints'
import analytics from '@/utils/analytics'

const CustomSearchBox: FunctionComponent<
  React.PropsWithChildren<SearchBoxProps>
> = (props) => {
  const {placeholder = 'Search for Anything'} = props
  const {query, refine} = useSearchBox(props)

  const [timerId, setTimerId] = React.useState<NodeJS.Timeout | null>()
  const [trackTimerId, setTrackTimerId] =
    React.useState<NodeJS.Timeout | null>()

  const [value, setValue] = React.useState<string>(query)

  const {sm} = useBreakpoint()

  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const onChangeDebounced = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    if (timerId) clearTimeout(timerId)
    if (trackTimerId) clearTimeout(trackTimerId)

    setTimerId(
      setTimeout(() => {
        refine(value)
      }, 450),
    )

    setTrackTimerId(
      setTimeout(() => {
        analytics.events.engagementSearchedWithQuery('search page', value)
      }, 1500),
    )

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
