import {buildTitleFromUrl, createUrl, parseUrl} from '../search-url-builder'
import config from '../config'

test('Builds a Title Based on single Tag and Instructor', () => {
  const title = buildTitleFromUrl('/s/react-lessons-by-kent-c-dodds')

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
    query: 'hooks',
    refinementList: {
      instructor_name: ['Kent C. Dodds'],
      _tags: ['react'],
    },
  })

  expect(url).toBe('/s/react-lessons-by-kent-c-dodds?q=hooks')
})

test('creates a url with a query with single tag and instructor filtered by type', () => {
  const url = createUrl({
    query: 'hooks',
    refinementList: {
      instructor_name: ['Kent C. Dodds'],
      _tags: ['react'],
      types: ['course'],
    },
  })

  expect(url).toBe('/s/react-lessons-by-kent-c-dodds?q=hooks&types=course')
})

test('creates a url with a query with single tag and instructor filtered by multiple types', () => {
  const url = createUrl({
    query: 'hooks',
    refinementList: {
      instructor_name: ['Kent C. Dodds'],
      _tags: ['react'],
      types: ['course', 'podcast'],
    },
  })

  expect(url).toBe(
    '/s/react-lessons-by-kent-c-dodds?q=hooks&types=course%2Cpodcast',
  )
})

test('creates a url with a query with single tag and instructor named Kent C. Dodds', () => {
  const url = createUrl({
    refinementList: {
      instructor_name: ['Kent C. Dodds'],
      _tags: ['react'],
    },
  })

  expect(url).toBe('/s/react-lessons-by-kent-c-dodds')
})

test('creates a url with a query with single tag and instructor not named Kent C. Dodds', () => {
  const url = createUrl({
    refinementList: {
      instructor_name: ['Ceora Ford'],
      _tags: ['react'],
    },
  })

  expect(url).toBe('/s/react-lessons-by-ceora-ford')
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

  expect(url).toBe('/s/lessons-by-ceora-ford')
})

test('parses a url tag and instructor', () => {
  const searchParams = parseUrl({
    search: '',
    pathname: '/s/react-lessons-by-kent-c-dodds',
  })

  expect(searchParams).toEqual({
    tags: ['react'],
    instructors: ['Kent C. Dodds'],
  })
})

test('parses a url tag and instructor and query', () => {
  const searchParams = parseUrl({
    search: '?q=react%20hooks',
    pathname: '/s/react-lessons-by-kent-c-dodds',
  })

  expect(searchParams).toEqual({
    query: 'react hooks',
    tags: ['react'],
    instructors: ['Kent C. Dodds'],
  })
})

test('parses a url tag and instructor types and query', () => {
  const searchParams = parseUrl({
    search: '?q=react%20hooks&types=course%2Cpodcast',
    pathname: '/s/react-lessons-by-kent-c-dodds',
  })

  expect(searchParams).toEqual({
    query: 'react hooks',
    tags: ['react'],
    instructors: ['Kent C. Dodds'],
    types: ['course', 'podcast'],
  })
})
