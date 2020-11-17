import {find} from 'lodash'
import dependencies from './courseDependencies.json'

export default (courseSlug: string) =>
  find(dependencies, {slug: courseSlug}) || {}
