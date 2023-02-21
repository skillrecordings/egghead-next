import dependencies from './courseDependenciesData'

type CourseDependencies =
  | {
      id?: number
      type?: string
      guid?: string
      slug: string
      dependencies?: {
        [key: string]: string | undefined
      }
      courseProject?: object
      illustrator?: object
      freshness?: object
      topics?: string[]
      quickFacts?: string[]
      nextSteps?: string[]
      prerequisites?: string[]
      essentialQuestions?: string[]
      pairWithResources?: object[]
    }
  | undefined

const courseDependencies = (courseSlug: string): CourseDependencies =>
  dependencies(courseSlug) || undefined

export default courseDependencies
