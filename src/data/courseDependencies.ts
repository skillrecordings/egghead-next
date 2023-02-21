import dependencies from './courseDependenciesData'

type CourseDependencies =
  | undefined
  | {
      id?: number
      type?: string
      guid?: string
      slug: string
      dependencies?: {
        [key: string]: string | undefined
      }
      illustrator?: object
      freshness?: object
      topics?: string[]
      quickFacts?: string[]
      nextSteps?: string[]
      essentialQuestions?: string[]
      pairWithResources?: object[]
    }
const courseDependencies = (courseSlug: string): CourseDependencies =>
  dependencies(courseSlug) || undefined

export default courseDependencies
