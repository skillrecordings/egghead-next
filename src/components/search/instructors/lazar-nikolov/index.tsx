import CtaCard from '@/components/search/components/cta-card'
import SearchInstructorEssential from '../instructor-essential'

const SearchLazarNikolov = ({instructor}: {instructor: any}) => {
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
            location="Lazar Nikolov instructor page"
          />
        }
      />
    </div>
  )
}
export default SearchLazarNikolov

const curatedInstructorData = {
  courses: {
    resources: [
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1633112015/next.egghead.io/resources/build-a-modern-user-interface-with-chakra-ui-fac68106/feature-card-background--modern-interface-chakra-ui.png',
        byline: 'Lazar Nikolov・42m・Course',
        description:
          'Lazar will show you how to build well-designed user interfaces without spending a lot of time (if even) styling every component and element with Chakra UI.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/505/265/full/chakra-lv1.png',
        instructor: {
          name: 'Lazar Nikolov',
        },
        path: '/courses/build-a-modern-user-interface-with-chakra-ui-fac68106',
        title: 'Build a Modern User Interface with Chakra UI',
      },
    ],
  },
  title: 'Lazar Nikolov Landing Page',
} as Record<string, any>
