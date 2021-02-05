import * as React from 'react'

import Image from 'next/image'
import Card from 'components/pages/home/card'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Link from 'next/link'
import {get, first} from 'lodash'
import SearchCuratedEssential from '../curated-essential'

const SanityLoadingData = () => {
  const location = 'css landing page'
  const [data, setData] = React.useState<any>()
  React.useEffect(() => {
    const slug = 'rad-css'
    async function run() {
      const data = await sanityClient.fetch(
        groq`
          *[slug.current == 'rad-css']{
            name,
            title,
            description,
            summary,
            meta,
            challengeRating,
            image,
            type,
            slug,
            content[] {
              label,
              title,
              ctas[] {
                title,
              }
            },
            resources[]->{
              _id,
              title, 
              summary,
              image,
              meta,
              description,
              type,
              path,
              collaborators[]->{
                _id
              },
              resources[]->{
                _id,
                title, 
                summary,
                meta,
                description,
                image,
                type,
                path,
                'instructor': collaborators[][0]->{
                  _id,
                  title,
                  'name': person->name
                }
            }
            }
          }[0]`,
      )

      setData(data)
    }
    run()
  }, [])
  console.log(data)

  const setImageSize = (imageUrl: string) => {
    return imageUrl.includes('tags') ? 32 : 48
  }

  return data ? (
    <main className="max-w-screen-xl mx-auto">
      <SearchCuratedEssential
        topic={{
          label: 'CSS',
          name: 'css',
          description: data.description,
        }}
      />
      <div className="grid grid-cols-3 sm:gap-8 gap-5 ">
        {data.resources.map((resource: any) => {
          const resources = resource.resources
          const resourceTitle = resource.title.replace('CSS', '')

          return (
            <Card
              location={location}
              key={resource._id}
              resource={{...resource, title: resourceTitle}}
            >
              <ul className="space-y-4 mt-4">
                {resources.map((resource: any) => {
                  return (
                    <li
                      key={resource._id}
                      className="items-center grid gap-x-3"
                      css={{
                        gridTemplateColumns: `48px 1fr`,
                      }}
                    >
                      <div className="w-full flex items-center justify-center">
                        <Image
                          src={resource.image}
                          alt={resource.title}
                          width={setImageSize(resource.image)}
                          height={setImageSize(resource.image)}
                        />
                      </div>
                      <div>
                        <Link href={resource.path}>
                          <a className="block font-semibold leading-tight">
                            {resource.title}
                          </a>
                        </Link>
                        <div className="text-sm text-gray-600">
                          {get(first(resource.instructor), 'name')}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )
        })}
      </div>
    </main>
  ) : null
}

export default SanityLoadingData
