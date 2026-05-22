import CtaCard from '@/components/search/components/cta-card'
import {CardResource} from '@/types'
import SearchInstructorEssential from '../instructor-essential'
import {VerticalResourceCard} from '@/components/card/verticle-resource-card'

const SearchRyanChenkie = ({instructor}: {instructor: any}) => {
  instructor = {...instructor, ...curatedInstructorData}
  const {courses} = instructor

  if (!courses) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <SearchInstructorEssential instructor={instructor} />
      </div>
    )
  }

  const [primaryCourse, ...restCourses] = courses.resources

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={primaryCourse}
            textLight
            trackTitle="clicked instructor landing page CTA resource"
            location="Ryan Chenkie instructor page"
          />
        }
      />
    </div>
  )
}
export default SearchRyanChenkie

const curatedInstructorData = {
  courses: {
    resources: [
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1630596747/egghead-next-pages/build-a-backend-with-prisma-in-a-typescript-node-project/feature-card-background--prisma.png',
        byline: 'Ryan Chenkie • 18m • Course',
        description:
          'In this course, you will learn how to initialize Prisma in a TypeScript Node project, use Prisma Client to create and find records, use Express to create data dynamically, and more',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/487/059/full/Prisma_TS.png',
        instructor: {
          name: 'Ryan Chenkie',
        },
        path: '/courses/build-a-backend-with-prisma-in-a-typescript-node-project-ca6628d3',
        title: 'Build a Backend with Prisma in a TypeScript Node Project',
      },
    ],
  },
  title: 'Ryan Chenkie Landing Page ',
} as Record<string, any>
