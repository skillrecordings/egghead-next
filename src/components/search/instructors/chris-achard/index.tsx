import {VerticalResourceCard} from '@/components/card/verticle-resource-card'
import {get} from 'lodash'
import CtaCard from '@/components/search/components/cta-card'
import SearchInstructorEssential from '../instructor-essential'

const SearchChrisAchard = ({instructor}: {instructor: any}) => {
  instructor = {...instructor, ...curatedInstructorData}
  const {chrisAchardCta} = instructor

  if (!chrisAchardCta) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <SearchInstructorEssential instructor={instructor} />
      </div>
    )
  }

  const location = 'chris achard landing page'

  const [cta, ...restCta] = chrisAchardCta.resources
  const courses = get(instructor, 'courses')

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={cta}
            textLight
            trackTitle="clicked instructor landing page CTA resource"
            location="Chris Achard instructor page"
          />
        }
      />
      <div className="lg:col-span-8 col-span-12 space-y-5 flex flex-col">
        <div className="flex flex-col flex-grow">
          <h2 className="sm:px-5 px-3 mt-4 lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
            Featured Courses
          </h2>
          <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-5 flex-grow">
            {courses.resources.map((resource: any) => {
              return (
                <VerticalResourceCard
                  className="col-span-4 text-center flex flex-col items-center justify-center"
                  key={resource.path}
                  resource={resource}
                  location={location}
                  describe={true}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
export default SearchChrisAchard

const curatedInstructorData = {
  chrisAchardCta: {
    resources: [
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1633706075/course-resources/react-crash-course-58eb/feature-card-background--build-static-pages-dynamically-using-nextjs-and-the-notion-api.png',
        byline: 'Chris Achard • 14m • Course',
        description:
          'This course gets you up and running with react in under a minute by using codesandbox.io to skip the painful process of setting up your dev environment.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/365/616/full/react-crash-course-hooks.png',
        instructor: {
          name: 'Chris Achard',
        },
        path: '/courses/react-crash-course-58eb',
        title: 'React Crash Course with Hooks',
      },
    ],
  },
  courses: {
    resources: [
      {
        background: null,
        byline: 'Chris Achard • Course • 45m',
        description:
          'In this course, we’ll create an online/offline note-taking app.  We’ll use `create-react-app` to create the frontend, and node.js to create a simple backend. ',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/497/full/EGH_PWAReact_Final.png',
        instructor: {
          name: 'Chris Achard',
        },
        path: '/courses/progressive-web-apps-in-react-with-create-react-app',
        title: 'Progressive Web Apps in React with create-react-app',
      },
      {
        background: null,
        byline: 'Chris Achard • Course • 1h 18m',
        description:
          'We’ll build a mobile app with React Native for both iOS and Android. Prior React experience is required, but you don’t have to know mobile development to participate.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/464/full/EGH_ReactTakeoutbox_.png',
        instructor: {
          name: 'Chris Achard',
        },
        path: '/courses/build-a-react-native-application-for-ios-and-android-from-start-to-finish',
        title:
          'Build a React Native Application for iOS and Android from Start to Finish',
      },
      {
        background: null,
        byline: 'Chris Achard ・16m・Course',
        description:
          "In this collection, you'll create a simple game with React using Recoil, to explore how you can share and update state across an app.",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/368/383/full/get-started-recoil.png',
        instructor: {
          name: 'Chris Achard',
        },
        path: '/courses/getting-started-with-recoil-in-react-1fca',
        title: 'Getting Started with Recoil in React',
      },
    ],
  },
  title: 'Chris Achard Landing Page',
} as Record<string, any>
