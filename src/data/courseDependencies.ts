import dependencies from './courseDependenciesData'

type CourseDependencies =
  | {
      id?: number
      type?: string
      guid?: string
      slug: string
      image?: string
      dependencies?: object
      multiModuleCourse?: boolean
      multiModuleSlug?: string
      multiModuletitle?: string
      totalCourseModules?: number
      moduleResource?: boolean
      moduleLabel?: number
      courseProject?: object
      illustrator?: object
      freshness?: object
      goals?: string[]
      topics?: string[]
      quickFacts?: string[]
      nextSteps?: string[]
      prerequisites?: object[]
      essentialQuestions?: string[]
      reviews?: object[]
      pairWithResources?: object[]
    }
  | undefined

const courseDependencies = (courseSlug: string): CourseDependencies =>
  dependencies(courseSlug)

export default courseDependencies
