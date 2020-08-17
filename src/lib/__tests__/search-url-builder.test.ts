import {buildTitleFromUrl, createUrl, parseUrl} from '../search-url-builder'
import config from '../config'

test('Builds a Title Based on single Tag and Instructor', () => {
  const title = buildTitleFromUrl('/s/react-videos-by-kent-c-dodds')

  expect(title).toBe(
    `${config.searchResultCount} Badass React Courses from Kent C. Dodds`,
  )
})

test('creates a url from empty search state', () => {
  const url = createUrl({})

  expect(url).toBe('/s/')
})

test('creates a url with a query with single tag and instructor named Kent C. Dodds', () => {
  const url = createUrl({
    refinementList: {
      instructor_name: ['Kent C. Dodds'],
      _tags: ['react'],
    },
  })

  expect(url).toBe('/s/react-videos-by-kent-c-dodds')
})

test('creates a url with a query with single tag and instructor not named Kent C. Dodds', () => {
  const url = createUrl({
    refinementList: {
      instructor_name: ['Ceora Ford'],
      _tags: ['react'],
    },
  })

  expect(url).toBe('/s/react-videos-by-ceora-ford')
})

test('creates a url multiple tags', () => {
  const url = createUrl({
    refinementList: {
      _tags: ['react', 'redux'],
    },
  })

  expect(url).toBe('/s/react-and-redux')
})

test('creates a url single instructor', () => {
  const url = createUrl({
    refinementList: {
      instructor_name: ['Ceora Ford'],
    },
  })

  expect(url).toBe('/s/videos-by-ceora-ford')
})

test('parses a complex url with query type multiple tags and multiple instructors', () => {
  const searchParams = parseUrl({
    search: '',
    pathname: '/s/react-videos-by-kent-c-dodds',
  })

  expect(searchParams).toEqual({
    tags: ['react'],
    instructors: ['Kent C. Dodds'],
  })
})
