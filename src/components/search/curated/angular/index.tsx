import React from 'react'
import angularPageData from './angular-page-data'
import {find} from 'lodash'
import {ThreeLevels} from '../curated-essential'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import {NextSeo} from 'next-seo'
import Topic from '../../components/topic'
import {useRouter} from 'next/router'

const SearchAngular = () => {
  const location = 'Angular Topic Page'
  const description =
    'Life is too short for long boring videos. Learn Angular using the best screencast tutorial videos online led by working professionals that learn in public'
  const title = `In-Depth Angular Resources for ${new Date().getFullYear()}`

  const beginner: any = find(angularPageData, {id: 'beginner'})
  const intermediate: any = find(angularPageData, {
    id: 'intermediate',
  })
  const advanced: any = find(angularPageData, {
    id: 'advanced',
  })
  const featurePodcast: any = find(angularPageData, {
    id: 'feature-podcast',
  })
  const featureCourse: any = find(angularPageData, {
    id: 'feature-course',
  })
  const secondaryFeatureCourse: any = find(angularPageData, {
    id: 'secondary-feature-course',
  })

  const stateManagementCourseOne: any = find(angularPageData, {
    id: 'state-management-course-one',
  })
  const stateManagementCourseTwo: any = find(angularPageData, {
    id: 'state-management-course-two',
  })
  const stateManagementCourseThree: any = find(angularPageData, {
    id: 'state-management-course-three',
  })
  const router = useRouter()

  return (
    <div>
      <NextSeo
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          title,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.vercel.app/topic/angular`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 items-start space-y-5 md:space-y-0 dark:bg-gray-900 -mx-5">
        <Topic
          className="col-span-8"
          title="Angular"
          imageUrl="https://og-image-react-egghead.now.sh/topic/angular?orientation=portrait&v=20201105"
        >
          {`Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations. Angular is a complete rewrite from the same team that built AngularJS.
          
Angular fully embraces functional and reactive programming with RxJS, while adding the power of strong typing via TypeScript.

Angular is sure to be a killer combination for large scale applications and big teams. Does that mean that it isn’t for you because you aren’t building a large app and don’t have a big team? No, it just means that these badass tools will scale really well. That’s a good sign. 

It’s worth an hour or so of your time to see what’s up!`}
        </Topic>
        <VerticalResourceCard
          resource={featureCourse}
          className="col-span-4 text-center relative z-10 p-6"
          location={location}
          describe={true}
          as="h2"
        >
          <div className="absolute top-0 left-0 bg-gradient-to-r from-red-600 to-red-400 w-full h-2 z-20" />
        </VerticalResourceCard>
      </div>

      <ThreeLevels
        beginner={beginner}
        intermediate={intermediate}
        advanced={advanced}
        location={location}
      />

      <div className="pb-12 pt-5">
        <h2 className="md:text-3xl text-2xl dark:text-gray-100 font-bold leading-tight text-center mb-4">
          State Management in Angular
        </h2>
        <p className="leading-relaxed text-gray-700 dark:text-gray-50 space-y-3 w-full max-w-screen-sm mx-auto text-center">
          Managing state in a UI is challenging. It's genuinely difficult and
          the solutions require a depth of knowledge and experience to
          understand. Everything is a balance of tradeoffs in complexity,
          performance, and user experience.{' '}
          <strong>
            These courses explore State Management in Angular web applications.
          </strong>
        </p>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-10">
          <VerticalResourceCard
            resource={stateManagementCourseOne}
            className="text-center relative z-10"
            location={location}
            describe={true}
          />

          <VerticalResourceCard
            resource={stateManagementCourseTwo}
            className="text-center relative z-10"
            location={location}
            describe={true}
          />

          <VerticalResourceCard
            resource={stateManagementCourseThree}
            className="text-center relative z-10"
            location={location}
            describe={true}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 mt-5 gap-4">
        <HorizontalResourceCard
          resource={featurePodcast}
          className="flex md:flex-row flex-col col-span-2"
          location={location}
        />
        <VerticalResourceCard
          resource={secondaryFeatureCourse}
          className="text-center relative z-10"
          location={location}
          describe={true}
        />
      </div>
    </div>
  )
}

export default SearchAngular
