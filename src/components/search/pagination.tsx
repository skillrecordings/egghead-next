import React from 'react'
import {Pagination as AlgoliaPagination} from 'react-instantsearch'
import 'instantsearch.css/themes/algolia-min.css'
import useBreakpoint from '@/utils/breakpoints'

const Pagination = () => {
  const {sm} = useBreakpoint()

  return (
    <AlgoliaPagination
      padding={sm ? 1 : 3}
      className="flex justify-center"
      showLast
      translations={{
        firstPageItemText: 'First',
        previousPageItemText: 'Previous',
        nextPageItemText: 'Next',
        lastPageItemText: 'Last',
      }}
    />
  )
}

export default Pagination
