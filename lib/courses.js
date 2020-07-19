import fs from 'fs'

const coursesPath = './data/series.json'

function readCourses() {
  const rawdata = fs.readFileSync(coursesPath)
  return JSON.parse(rawdata)
}

export function getCourseLessons() {
  const courses = readCourses()

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
        ...lesson,
        id: lesson.slug,
      },
    }
  })
}

export function getCourseData(id) {
  const courses = readCourses()
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
  const courses = readCourses()
  return courses.map((course) => {
    return {
      params: {
        ...course,
        id: course.slug,
      },
    }
  })
}
