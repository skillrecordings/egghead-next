export type Resource = {
  title: string
  slug: string
  description: string
  icon_url?: string
  completed: boolean
  path: string
}

export type LessonResource = Resource & {
  dash_url: string
  hls_url: string
  lesson_view_url: string
  id: string | number
  tags: any[]
  lessons: any[]
}
