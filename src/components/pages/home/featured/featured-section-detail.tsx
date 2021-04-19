import React, {FunctionComponent} from 'react'
import Card, {CardResource} from 'components/pages/home/card'
import Image from 'next/image'

type FeaturedSectionDetailProps = {
  featuredResources: any
  location?: any
  title: string
  children?: any
  image?: string
}

const FeaturedSectionDetail: FunctionComponent<FeaturedSectionDetailProps> = ({
  featuredResources,
  location,
  title,
  image,
  children,
}) => {
  return (
    <section className="mt-32 grid md:grid-cols-10 grid-cols-1 gap-5">
      <div className="md:col-span-3 col-span-1 flex flex-col">
        <h2 className="md:text-3xl text-2xl dark:text-gray-200 font-bold leading-tight mb-10 dark:text-white">
          {title}
        </h2>
        {image && (
          <div className="flex-shrink-0">
            <Image
              src={image}
              alt="illustration for Digital Gardening for Developers "
              width={232}
              height={283}
              quality={100}
            />
          </div>
        )}
      </div>
      <div className="md:col-span-7 col-span-1">
        <div className="leading-relaxed text-gray-700 dark:text-gray-50 space-y-6">
          {children && children}
        </div>
        <div className="grid md:grid-cols-12 grid-cols-2 gap-5 mt-8">
          {featuredResources.resources.map((resource: any) => {
            return (
              <Card
                className="col-span-4 text-center"
                key={resource.path}
                resource={resource}
                location={location}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturedSectionDetail
