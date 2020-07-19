import courses from '../data/series.json'

export function getCourseLessons() {
  const lessons = courses.reduce((acc, course) => {
    const lessons = course.lessons || []
    return [...acc, ...lessons]
  }, [])
  return lessons
}

export function getAllCourseLessonIds() {
  return getCourseLessons().map((lesson) => {
    return {
      params: {
        id: lesson.slug,
        ...lesson,
      },
    }
  })
}

export function getCourseData(id) {
  const course = courses.filter((course) => {
    return course.slug === id
  })[0]

  const {
    slug,
    title,
    summary,
    instructor,
    square_cover_256_url,
    lessons,
    rating_out_of_5,
    rating_count,
    watched_count,
  } = course

  return {
    id,
    slug,
    title,
    summary,
    instructor,
    square_cover_256_url,
    lessons,
    rating_out_of_5,
    rating_count,
    watched_count,
  }
}

export function getAllCourseIds() {
  return courses.map((course) => {
    return {
      params: {
        id: course.slug,
        ...course,
      },
    }
  })
}
