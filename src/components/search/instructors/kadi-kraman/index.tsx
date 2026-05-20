import CtaCard from '@/components/search/components/cta-card'
import SearchInstructorEssential from '../instructor-essential'

const SearchKadiKraman = ({instructor}: {instructor: any}) => {
  instructor = {...instructor, ...curatedInstructorData}
  const {courses} = instructor

  if (!courses) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <SearchInstructorEssential instructor={instructor} />
      </div>
    )
  }

  const [primaryCourse] = courses.resources

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={primaryCourse}
            textLight
            trackTitle="clicked instructor landing page CTA resource"
            location="Kadi Kraman instructor page"
          />
        }
      />
    </div>
  )
}
export default SearchKadiKraman

const curatedInstructorData = {
  courses: {
    resources: [
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1636483593/next.egghead.io/resources/building-an-customisable-animated-skeleton-loader-in-react-native-51f6231d/feature-card-background--Skeleton-react-native.png',
        byline: 'Kadi Karmann・29m・Course',
        description:
          "In 30 mins you'll get a quick intro to 3 powerful RN libraries linear gradient, masked view, reanimated 2, and then use them to build a customizable skeleton loader for your app!",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/504/652/full/React2_Lv1_Base_424_2x.png',
        instructor: {
          name: 'Kadi Kraman',
        },
        path: '/courses/building-a-customizable-animated-skeleton-loader-in-react-native-51f6231d',
        title:
          'Building a Customizable Animated Skeleton Loader in React Native',
      },
    ],
  },
  title: 'Kadi Kraman Landing Page',
} as Record<string, any>
