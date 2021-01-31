import DanAbramovPageData from './dan-abramov-page-data'
import {find} from 'lodash'
import Card from 'components/pages/home/card'
import Instructor from 'components/search/components/instructor'
import Image from 'next/image'
import ExternalTrackedLink from '../../../../external-tracked-link'

export default function SearchDanAbramov() {
  const instructorData: any = find(DanAbramovPageData, {
    id: 'instructor-data',
  })

  const featureCourses: any = find(DanAbramovPageData, {id: 'feature-courses'})

  return (
    <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-gray-900">
      <div className="md:grid md:grid-cols-12 grid-cols-1 gap-5 items-start space-y-5 md:space-y-0">
        <Instructor
          className="col-span-8"
          name={instructorData.name}
          company={instructorData.company}
          imageUrl={instructorData.imageUrl}
          twitterHandle={instructorData.twitterHandle}
          websiteURL={instructorData.websiteURL}
          slug={instructorData.slug}
        >
          {instructorData.bio}
        </Instructor>
        <ExternalTrackedLink
          params={instructorData.location}
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
      </div>

      <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-8">
        {featureCourses.resources.map((resource: any) => {
          return (
            <Card
              className="col-span-6 text-center"
              key={resource.path}
              resource={resource}
              location={instructorData.location}
            />
          )
        })}
      </div>
    </div>
  )
}
