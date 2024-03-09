import React from 'react'
import {Pagination as AlgoliaPagination} from 'react-instantsearch'
import useBreakpoint from '@/utils/breakpoints'

const Pagination = () => {
  const {sm} = useBreakpoint()

  return (
    <AlgoliaPagination
      padding={sm ? 1 : 3}
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
