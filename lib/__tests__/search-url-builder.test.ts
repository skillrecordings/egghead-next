import {buildTitleFromUrl} from '../search-url-builder'
import config from '../config'

test('Builds a Title Based on single Tag and Instructor', () => {
  const title = buildTitleFromUrl('/s/react/i/kent-c-dodds')

  expect(title).toBe(
    `${config.searchResultCount} Badass Courses from Kent C. Dodds`,
  )
})
