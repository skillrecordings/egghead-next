import React from 'react'
import {render} from '@testing-library/react'

test('renders deploy link', () => {
  const {getByText} = render(
    <h1 id="welcome-to-the-wip-of-the-next-version-of-eggheadio">
      Welcome to the WIP of the next version of egghead.io
    </h1>,
  )
  const linkElement = getByText(/Welcome to the WIP/)
  expect(linkElement).toBeInTheDocument()
})
