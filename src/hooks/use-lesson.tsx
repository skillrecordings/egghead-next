import * as React from 'react'
import {type Lesson} from '@/schemas/lesson'
import {type Section} from '@/schemas/section'
import {type Module} from '@/schemas/module'

type LessonContextType = {
  lesson: Lesson
  section?: Section
  module: Module
}

export const LessonContext = React.createContext({} as LessonContextType)

type LessonProviderProps = {
  lesson: Lesson
  module: Module
  section?: Section
  children: React.ReactNode
}

export const LessonProvider: React.FC<LessonProviderProps> = ({
  lesson,
  module,
  section,
  children,
}) => {
  const context = {
    lesson,
    module,
    section,
  }
  return (
    <LessonContext.Provider value={context}>{children}</LessonContext.Provider>
  )
}

export const useLesson = () => {
  const videoResourceContext = React.useContext(LessonContext)
  return videoResourceContext
}
