import * as React from 'react'

import Image from 'next/image'
import Card from 'components/pages/home/card'
import Collection from 'components/pages/home/collection'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const SanityLoadingData = () => {
  const location = 'test'
  const [data, setData] = React.useState<any>()
  React.useEffect(() => {
    const slug = 'state-management-in-react'
    async function run() {
      const data = await sanityClient.fetch(
        groq`
          *[slug.current == $slug]{
            title,
            description,
            summary,
            meta,
            challengeRating,
            'image': externalPreviewImageUrl,
            type,
            slug,
            related[]->{
              _id,
              title, 
              summary,
              meta,
              description,
              'image': externalPreviewImageUrl,
              type,
              path
            },
            resources[]{
              _id,
              title, 
              summary,
              'image': externalPreviewImageUrl,
              meta,
              description,
              type,
              path,
              related[]->{
              _id,
              title, 
              summary,
              meta,
              description,
              'image': externalPreviewImageUrl,
              type,
              path
            },
              resources[]{
              _id,
              title, 
              summary,
              'image': externalPreviewImageUrl,
              meta,
              description,
              type,
              path
            }
            }
          }[0]`,
        {slug},
      )

      setData(data)
    }
    run()
  }, [])
  return data ? (
    <section className="md:mt-20 mt-5 grid lg:grid-cols-12 grid-cols-1 gap-5 md:bg-gray-100 dark:bg-gray-700 rounded-lg p-4 md:p-5">
      <div className="lg:col-span-8 col-span-12 space-y-5">
        <header className="py-5 md:px-8 px-5 rounded-md flex md:flex-row flex-col md:text-left text-center md:space-y-0 space-y-3 md:items-start items-center justify-center md:space-x-5 space-x-0">
          <div className="flex-shrink-0">
            <Image
              src={data.image}
              alt="illustration for state management in react"
              width={150}
              height={150}
              quality={100}
            />
          </div>
          <div className="max-w-screen-sm space-y-3">
            <h1 className="md:text-3xl text-2xl dark:text-gray-200 font-bold leading-tight">
              {data.title}
            </h1>
            <div className="leading-relaxed text-gray-700 dark:text-gray-50 space-y-3">
              {data.description}
            </div>
          </div>
        </header>
        <div>
          <Card
            resource={data.resources?.[0]}
            className="flex md:flex-row flex-col"
            location={location}
          >
            <div className="sm:w-full sm:-mt-5 -mt-0 sm:-mb-5 -mb-4 md:-mr-5 -mr-4 md:ml-8 -ml-4  flex items-center bg-black flex-shrink-0 md:max-w-sm">
              Player
            </div>
          </Card>
          <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-5">
            {data.related.map((resource: any) => {
              resource.path = `/${resource.type}/${resource.slug}`
              return (
                <Card
                  className="col-span-4 text-center"
                  key={resource.title}
                  resource={resource}
                  location={location}
                />
              )
            })}
          </div>
        </div>
      </div>
      <div className="md:col-span-4 col-span-12">
        <Card resource={data.resources?.[1]} location={location}>
          <Collection />
        </Card>
        <Card
          resource={{
            ...data.resources?.[2],
            resources: data.resources?.[2].related.map((resource: any) => {
              resource.path = `/${resource.type}s/${resource.slug}`
              return resource
            }),
          }}
          className="mt-5"
          location={location}
        >
          <Collection />
        </Card>
      </div>
    </section>
  ) : null
}

export default SanityLoadingData
