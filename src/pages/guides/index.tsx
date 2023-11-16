import React from 'react'
import GuideTemplate from '@/components/guides/guide-template'
import {getGuides} from '@/lib/guides'
import {GetStaticProps} from 'next'

export const getStaticProps: GetStaticProps = async () => {
  const guides = await getGuides()
  const indexAsGuide = {
    title: 'Learning Guides',
    description:
      'A collection of curated learning guides for professional web developers.',
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1698761176/guides/guides-index.jpg',
    ogImage:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1698761977/guides/card-guides-index_2x.png',
    sections: [
      {
        title: 'Latest Guides',
        resources: guides.filter(
          (guide) => guide.state === 'published' && guide,
        ),
      },
    ],
  }
  return {props: {indexAsGuide}, revalidate: 60}
}

const GuidesIndex: React.FC<any> = ({indexAsGuide}) => {
  return <GuideTemplate guide={indexAsGuide} />
}

export default GuidesIndex
