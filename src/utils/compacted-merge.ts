import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'

// A typical ES6 destructuring merge ({ ...obj1, ...obj2 }) will allow values
// of `null` and `undefined` to override actual values. This compactedMerge
// function first removes the `null` and `undefined` key-value pairs from each
// object before merging them.
//
// This ensures that if the first object has a key-value pair like
// `lesson_view_url: '/some/url'` that it doesn't get overridden by the second
// object having `lesson_view_url: undefined`.
const compactedMerge = (obj1: any, obj2: any): any => {
  return {...removeNilValues(obj1), ...removeNilValues(obj2)}
}

const removeNilValues = (obj: any): any => {
  return omitBy(obj, isNil)
}

export default compactedMerge
