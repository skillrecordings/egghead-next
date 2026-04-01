import GuideTemplate from '@/components/guides/guide-template'
import {Guide} from '@/lib/guides'
import {loadGuide, loadGuides} from '@/lib/load-guide-wrapper'
import {GetStaticPaths, GetStaticProps} from 'next'

type Props = {
  guide: Guide
}

const GuidePage = ({guide}: Props) => {
  return guide ? <GuideTemplate guide={guide} /> : null
}

export const getStaticPaths: GetStaticPaths = async () => {
  const guides = await loadGuides()

  const paths = guides
    .filter((guide) => guide.state === 'published' && guide.slug)
    .map((guide) => ({
      params: {slug: guide.slug!},
    }))

  return {paths, fallback: 'blocking'}
}

export const getStaticProps: GetStaticProps<Props> = async ({params}) => {
  const {slug} = params as {slug: string}
  const guide = await loadGuide(slug)

  if (!guide) {
    return {notFound: true, revalidate: 60}
  }

  return {props: {guide}, revalidate: 60}
}

export default GuidePage
