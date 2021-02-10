import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

export default function LoadDataFromSanity() {
  const [data, setData] = React.useState<any>()
  React.useEffect(() => {
    const slug = 'curated-css-resources'
    async function run() {
      const data = await sanityClient.fetch(
        groq`
        *[slug.current == $slug][0]{
          name,
          title,
          description,
          summary,
          byline, 
          meta,
          image,
          slug,
          path,
          resources[]->{
            _id,
            title, 
            name,
            summary,
            slug,
            meta,
            description,
            image,
            type,
            path,
            resources[]->{
              _id,
              title,
              slug,
              name,
              'image': externalPreviewImageUrl,
              path,
              'instructor': collaborators[]->[role == 'instructor'][0]{
                title,
                'slug': person->slug.current,
                'name': person->name,
                'path': person->website,
                'twitter': person->twitter,
                'image': person->image.url
              },
              resources[]->{
                _id,
                title,
                slug,
                name,
                'image': externalPreviewImageUrl,
                path,
                'instructor': collaborators[]->[role == 'instructor'][0]{
                  title,
                  'slug': person->slug.current,
                  'name': person->name,
                  'path': person->website,
                  'twitter': person->twitter,
                  'image': person->image.url
                },
              }
            }
        }
        }`,
        {slug},
      )
      setData(data)
    }
    run()
  }, [])

  return data
}
