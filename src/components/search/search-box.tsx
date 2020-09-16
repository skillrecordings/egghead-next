import React, {FunctionComponent} from 'react'
import {connectSearchBox} from 'react-instantsearch-dom'

type CustomSearchBoxProps = {
  currentRefinement: any
  refine: any
}

const CustomSearchBox: FunctionComponent<CustomSearchBoxProps> = ({
  currentRefinement,
  refine,
}) => (
  <form noValidate action="" role="search" className="mx-auto max-w-full">
    <div className="mr-6 my-2 mx-auto pb-4 flex items-center justify-center">
      <input
        type="search"
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
        placeholder="Type here to search..."
        className="bg-purple-white shadow rounded border-0 p-5 w-4/6"
      />
    </div>
  </form>
)

const SearchBox = connectSearchBox(CustomSearchBox)

export default SearchBox
