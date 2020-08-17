import {buildTitleFromUrl, createUrl, parseUrl} from '../search-url-builder'
import config from '../config'

test('Builds a Title Based on single Tag and Instructor', () => {
  const title = buildTitleFromUrl('/s/react/i/kent-c-dodds')

  expect(title).toBe(
    `${config.searchResultCount} Badass Courses from Kent C. Dodds`,
  )
})

test('creates a url from empty search state', () => {
  const url = createUrl({})

  expect(url).toBe('/search')
})

test('creates a url with a query', () => {
  const url = createUrl({query: 'hooks'})

  expect(url).toBe('/search~~q~~hooks')
})

test('creates link with topic name encoded', () => {
  const url = createUrl({refinementList: {_tags: ['react']}})
  expect(url).toBe('/search~~in~~react')
})

test('creates link with instructor name encoded', () => {
  const url = createUrl({refinementList: {instructor_name: ['Kent C. Dodds']}})
  expect(url).toBe('/search~~by~~Kent+C.+Dodds')
})

test('creates link with tag encoded', () => {
  const url = createUrl({refinementList: {type: ['course']}})
  expect(url).toBe('/search~~t~~course')
})

test('creates combined url with type, tag, and instructor', () => {
  const url = createUrl({
    refinementList: {
      instructor_name: ['Kent C. Dodds'],
      type: ['course'],
      _tags: ['react'],
    },
  })
  expect(url).toBe('/search~~t~~course~~in~~react~~by~~Kent+C.+Dodds')
})

test('creates combined url with type, tag, and multiple instructors', () => {
  const url = createUrl({
    refinementList: {
      instructor_name: ['Kent C. Dodds', 'Ceora Ford'],
      type: ['course'],
      _tags: ['react'],
    },
  })
  expect(url).toBe(
    '/search~~t~~course~~in~~react~~by~~Kent+C.+Dodds~Ceora+Ford',
  )
})

test('creates combined url with query type, tag, and multiple instructors', () => {
  const url = createUrl({
    query: 'hooks',
    refinementList: {
      instructor_name: ['Kent C. Dodds', 'Ceora Ford'],
      type: ['course'],
      _tags: ['react'],
    },
  })
  expect(url).toBe(
    '/search~~q~~hooks~~t~~course~~in~~react~~by~~Kent+C.+Dodds~Ceora+Ford',
  )
})

test('parses a url with a query in the path', () => {
  const {query} = parseUrl({
    search: '',
    pathname: '/search~~q~~hooks',
  })

  expect(query).toBe('hooks')
})

test('parses a url with no query in the path', () => {
  const {query} = parseUrl({
    search: '',
    pathname: '/search',
  })

  expect(query).toBe('')
})

test('parses a complex url with query type tag and multiple instructors', () => {
  const searchParams = parseUrl({
    search: '',
    pathname:
      '/search~~q~~hooks~~t~~course~~in~~react~aws~~by~~Kent+C.+Dodds~Ceora+Ford',
  })

  expect(searchParams).toEqual({
    query: 'hooks',
    tags: ['react', 'aws'],
    types: ['course'],
    instructors: ['Kent C. Dodds', 'Ceora Ford'],
  })
})

test('parses a complex url with query type multiple tags and multiple instructors', () => {
  const searchParams = parseUrl({
    search: '',
    pathname:
      '/search~~q~~redux+hooks+typescript~~t~~course~~in~~react~aws~~by~~Kent+C.+Dodds~Ceora+Ford',
  })

  expect(searchParams).toEqual({
    query: 'redux hooks typescript',
    tags: ['react', 'aws'],
    types: ['course'],
    instructors: ['Kent C. Dodds', 'Ceora Ford'],
  })
})

test('parses a complex url with query multiple types multiple tags and multiple instructors', () => {
  const searchParams = parseUrl({
    search: '',
    pathname:
      '/search~~q~~redux+hooks+typescript~~t~~course+lesson~~in~~react~aws~~by~~Kent+C.+Dodds~Ceora+Ford',
  })

  expect(searchParams).toEqual({
    query: 'redux hooks typescript',
    tags: ['react', 'aws'],
    types: ['course', 'lesson'],
    instructors: ['Kent C. Dodds', 'Ceora Ford'],
  })
})
