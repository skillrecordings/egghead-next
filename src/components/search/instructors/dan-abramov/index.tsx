import DanAbramovPageData from './dan-abramov-page-data'
import {find} from 'lodash'
import Image from 'next/image'
import SearchInstructorEssential from '../instructor-essential'
import ExternalTrackedLink from '../../../external-tracked-link'
import {VerticalResourceCard} from '../../../card/verticle-resource-card'

export default function SearchDanAbramov({instructor}: {instructor: any}) {
  const instructorData: any = find(DanAbramovPageData, {
    id: 'instructor-data',
  })

  const combinedInstructor = {...instructor, ...instructorData}

  const featureCourses: any = find(DanAbramovPageData, {id: 'feature-courses'})

  const JustJavaScriptCTA: React.FC = () => (
    <ExternalTrackedLink
      params={{
        location: instructorData.location,
      }}
      href={instructorData.ctaLink}
      eventName="clicked testing javascript banner"
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 bg-white relative text-center shadow-sm"
    >
      <Image
        src={instructorData.ctaImage}
        alt={instructorData.ctaTitle}
        priority
        quality={100}
        width={417}
        height={463}
      />
    </ExternalTrackedLink>
  )

  return (
    <SearchInstructorEssential
      instructor={combinedInstructor}
      CTAComponent={<JustJavaScriptCTA />}
    >
      <section>
        <h2 className="sm:px-5 px-3 my-4 lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
          Featured Courses
        </h2>
        <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-8">
          {featureCourses.resources.map((resource: any) => {
            return (
              <VerticalResourceCard
                className="col-span-6 text-center"
                key={resource.path}
                resource={resource}
                location={instructorData.location}
              />
            )
          })}
        </div>
      </section>
    </SearchInstructorEssential>
  )
}
