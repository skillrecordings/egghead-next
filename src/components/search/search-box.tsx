import React, {FunctionComponent} from 'react'
import {connectSearchBox} from 'react-instantsearch-dom'

type CustomSearchBoxProps = {
  currentRefinement: any
  refine: any
  className?: any
}

const CustomSearchBox: FunctionComponent<CustomSearchBoxProps> = ({
  currentRefinement,
  refine,
  className,
}) => {
  return (
    <form
      noValidate
      action=""
      role="search"
      className={`${className ? className : ''}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* prettier-ignore */}
          <svg className="text-gray-500" width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
        </div>
        <input
          type="search"
          value={currentRefinement}
          onChange={(event) => refine(event.currentTarget.value)}
          placeholder="What do you want to learn today?"
          className="bg-gray-100 rounded-md px-5 py-3 pl-10 w-full border border-transparent focus:outline-none focus:border-gray-400 placeholder-gray-600"
        />
      </div>
    </form>
  )
}

const SearchBox = connectSearchBox(CustomSearchBox)

export default SearchBox
