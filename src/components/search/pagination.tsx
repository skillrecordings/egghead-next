import React, {FunctionComponent} from 'react'
import {connectPagination} from 'react-instantsearch-dom'

type PaginationProps = {
  currentRefinement: any
  nbPages: any
  refine: any
  createURL: any
}

const Pagination: FunctionComponent<PaginationProps> = ({
  currentRefinement,
  nbPages,
  refine,
  createURL,
}) => (
  <ul>
    {new Array(nbPages).fill(null).map((_, index) => {
      const page = index + 1

      return (
        <li key={index}>
          <a
            href={createURL(page)}
            style={{fontWeight: currentRefinement === page ? 'bold' : 'normal'}}
            onClick={(event) => {
              event.preventDefault()
              refine(page)
            }}
          >
            {page}
          </a>
        </li>
      )
    })}
  </ul>
)

const CustomPagination = connectPagination(Pagination)

export default CustomPagination
