import dependencies from './courseDependenciesData'

const courseDependencies = (courseSlug: string) =>
  dependencies(courseSlug) || {}

export default courseDependencies
