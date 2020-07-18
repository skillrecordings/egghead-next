import lessons from '../data/lessons.json'

export function getLessonData(id) {
  const lesson = lessons.filter((lesson) => {
    return lesson.slug === id
  })[0]

  return {
    id,
    ...lesson,
  }
}

export function getAllLessonIds() {
  return lessons.map((lesson) => {
    return {
      params: {
        id: lesson.slug,
        ...lesson,
      },
    }
  })
}
