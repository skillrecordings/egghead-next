import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

function useLoadTypeData(type: string, initialData: any) {
  const [typeData, setData] = React.useState<any>(initialData)
  const [isLoading, setLoading] = React.useState<boolean>(false)
  React.useEffect(() => {
    async function getData() {
      setLoading(true)
      await sanityClient
        .fetch(typeQuery, {
          slug: type,
        })
        .then((data) => {
          setData(data)
          setLoading(false)
        })
    }
    type && getData()
  }, [type])

  return {isLoading, typeData}
}

export default useLoadTypeData

export const typeQuery = groq`*[_type == 'resource' && type == 'landing-page' && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  description,
  image,
  'ogImage': images[label == 'og-image'][0].url,
  'featuredCollections': resources[slug.current == 'featured-collections'][0] {
    resources[] {
      title,
      byline,
      description,
      summary,
      image,
      'host': collaborators[]->[role == 'host'][0]{
        'name': person->name,
        'image': person->image.url
      },
      resources [] {
        title,
        description,
        summary,
        byline,
        path,
        'instructor': collaborators[]->[role == 'instructor'][0]{
            'name': person->name,
            'image': person->image.url
        },
      }
    }
  },
  'featuredResources': resources[slug.current == 'featured-resources'][0] {
      resources[] {
        title,
        byline,
        description,
        'host': collaborators[]->[role == 'host'][0]{
        	'name': person->name,
        	'image': person->image.url
      	},
				'interviewee': collaborators[]->[role == 'instructor'][0]{
        	'name': person->name,
        	'image': person->image.url
      	},
        summary,
        image,
        "quote": content[label == "quote"][0].text

      }
   }	
}`
