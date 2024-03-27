import * as React from 'react'
import groq from 'groq'
import {sanityClient} from '@/utils/sanity-client'
import {topicExtractor} from '@/utils/search/topic-extractor'
import {first} from 'lodash'
import {loadTag} from '@/lib/tags'

function useLoadTopicData(
  initialTopicGraphqlData: any,
  initialTopicSanityData: any,
  searchState: any,
) {
  const [topicGraphqlData, setTopicGraphqlData] = React.useState<any>(
    initialTopicGraphqlData,
  )
  const [topicSanityData, setTopicSanityData] = React.useState<any>(
    initialTopicSanityData,
  )
  const [loading, setLoading] = React.useState<boolean>(false)

  const selectedTopics: any = topicExtractor(searchState)
  const newTopic =
    selectedTopics.length === 1 ? first<string>(selectedTopics) : false

  React.useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function getData() {
      setLoading(true)
      try {
        const sanityData = await sanityClient.fetch(
          topicQuery,
          {
            slug: newTopic,
          },
          {signal},
        )

        if (sanityData) {
          setTopicSanityData(sanityData)
          setTopicGraphqlData({name: sanityData.slug})
        }

        if (!sanityData && newTopic) {
          const graphqlData = await loadTag(newTopic)
          setTopicSanityData(null)
          setTopicGraphqlData(graphqlData)
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching topic data: ', error)
        }
      } finally {
        setLoading(false)
      }
    }

    if (newTopic) {
      getData()
    } else {
      setTopicSanityData(null)
      setTopicGraphqlData(null)
    }

    return () => {
      controller.abort()
    }
  }, [newTopic, searchState])

  return {loading, topicSanityData, topicGraphqlData}
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
        'instructor': collaborators[@->.role == 'instructor'][0]->{
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
          externalId,
          title,
          'name': type,
          path,
          image,
          'instructor': collaborators[@->.role == 'instructor'][0]->{
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
          externalId,
          title,
          'name': type,
          'description': summary,
          path,
          image,
          images,
          'instructor': collaborators[@->.role == 'instructor'][0]->{
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
          'description': summary,
          'instructor': collaborators[@->.role == 'instructor'][0]->{
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
            'instructor': collaborators[@->.role == 'instructor'][0]->{
              'name': person->name,
              'image': person->image.url
          },
          }
        }
      }
    }
  }`
