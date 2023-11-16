import GuideTemplate from '@/components/guides/guide-template'
import {Guide, getGuide, getGuides} from '@/lib/guides'
import {GetStaticPaths, GetStaticProps} from 'next'
import {useRouter} from 'next/router'

type Props = {
  guide: Guide
}

const GuidePage = ({guide}: Props) => {
  return guide ? <GuideTemplate guide={guide} /> : null
}

export const getStaticPaths: GetStaticPaths = async () => {
  const guides = await getGuides()

  const paths = guides.map((guide: any) => ({
    params: {slug: guide.slug},
  }))

  return {paths: paths, fallback: false}
}

export const getStaticProps: GetStaticProps<Props> = async ({params}) => {
  const {slug} = params as {slug: string}
  const guide = await getGuide(slug)

  return {props: {guide}, revalidate: 60}
}

export default GuidePage
