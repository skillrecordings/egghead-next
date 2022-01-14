import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

function useLoadTopicData(topic: string, initialData: any) {
  const [topicData, setData] = React.useState<any>(initialData)
  const [isLoading, setLoading] = React.useState<boolean>(false)
  React.useEffect(() => {
    async function getData() {
      setLoading(true)
      await sanityClient
        .fetch(topicQuery, {
          slug: topic,
        })
        .then((data) => {
          setData(data)
          setLoading(false)
        })
    }
    topic && getData()
  }, [topic])

  return {isLoading, topicData}
}

export default useLoadTopicData

export const topicQuery = groq`*[_type == 'resource' && type == 'landing-page' && slug.current == $slug][0]{
    "slug": slug.current,
    title,
    description,
    image,
    'ogImage': images[label == 'og-image'][0].url,
    'jumbotron': resources[slug.current == 'jumbotron'][0]{
      image,
      "slug": slug.current,
      'resource': resources[][0]{
        "id": _id,
        "slug": slug.current,
        title,
        'path': url,
        url,
        image,
        description,
        'background': images[label == 'background'][0].url,
        'instructor': collaborators[]->[role == 'instructor'][0]{
              'name': person->name,
              'image': person->image.url
          }
      }
    },
    'levels': resources[slug.current == 'levels'][0]{
      'id': _id,
      image,
      subTitle,
      resources[]{
        'id': _id,
        title,
        subTitle,
        resources[]->{
          'id': _id,
          title,
          'name': type,
          path,
          image,
          'instructor': collaborators[]->[role == 'instructor'][0]{
              'name': person->name,
              'image': person->image.url
          }
        }
      }
    },
    'sections': resources[slug.current != 'levels' && slug.current != 'jumbotron']{
      'id': _id,
      title,
      'slug': slug.current,
      image,
      path,
      description,
      resources[]{
        _type == 'reference' => @->{
          'id': _id,
          title,
          'name': type,
          'description': summary,
          path,
          image,
          images,
          'instructor': collaborators[]->[role == 'instructor'][0]{
              'name': person->name,
              'image': person->image.url
          }
        },
        _type != 'reference' => {
          'id': _id,
          title,
          path,
          url,
          image,
          'name': type,
          'instructor': collaborators[]->[role == 'instructor'][0]{
              'name': person->name,
              'image': person->image.url
          },
          resources[]->{
            'id': _id,
            title,
            'name': type,
            'description': summary,
            path,
            image,
            'instructor': collaborators[]->[role == 'instructor'][0]{
              'name': person->name,
              'image': person->image.url
          },
          }
        }
      }
    }
  }`
