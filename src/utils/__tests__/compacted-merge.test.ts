import compactedMerge from '../compacted-merge'

test('it can merge two objects together', () => {
  const secondaryObject = {
    title: 'Ignored Title',
    lesson_view_url: '/some/url',
    thumb_url: '',
  }

  const primaryObject = {
    title: 'Actual Title',
    duration: 123,
    count: 0,
  }

  const expectedResult = {
    title: 'Actual Title',
    lesson_view_url: '/some/url',
    duration: 123,
    thumb_url: '',
    count: 0,
  }

  const result = compactedMerge(secondaryObject, primaryObject)

  expect(result).toEqual(expectedResult)
})

test('it ignores a null value in the preferred object', () => {
  const secondaryObject = {
    title: 'Ignored Title',
    lesson_view_url: '/some/url',
  }

  const primaryObject = {
    title: 'Actual Title',
    lesson_view_url: null,
    duration: 123,
  }

  const expectedResult = {
    title: 'Actual Title',
    lesson_view_url: '/some/url',
    duration: 123,
  }

  const result = compactedMerge(secondaryObject, primaryObject)

  expect(result).toEqual(expectedResult)
})

test('it ignores an undefined value in the preferred object', () => {
  const secondaryObject = {
    title: 'Ignored Title',
    lesson_view_url: '/some/url',
  }

  const primaryObject = {
    title: 'Actual Title',
    lesson_view_url: undefined,
    duration: 123,
  }

  const expectedResult = {
    title: 'Actual Title',
    lesson_view_url: '/some/url',
    duration: 123,
  }

  const result = compactedMerge(secondaryObject, primaryObject)

  expect(result).toEqual(expectedResult)
})

test('it ignores null and undefined values in the secondary object', () => {
  const secondaryObject = {
    title: 'Ignored Title',
    lesson_view_url: '/some/url',
    duration: null,
    slug: undefined,
  }

  const primaryObject = {
    title: 'Actual Title',
    duration: 123,
  }

  const expectedResult = {
    title: 'Actual Title',
    lesson_view_url: '/some/url',
    duration: 123,
  }

  const result = compactedMerge(secondaryObject, primaryObject)

  expect(result).toEqual(expectedResult)
})
