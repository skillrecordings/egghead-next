import React from 'react'
import {render} from '@testing-library/react'
import Index from '../pages/index'

test('renders deploy link', () => {
  const {getByText} = render(<div>Search for stuff.</div>)
  const linkElement = getByText(/Search for stuff\./)
  expect(linkElement).toBeInTheDocument()
})
