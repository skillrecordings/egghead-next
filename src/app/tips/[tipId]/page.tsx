import TipTemplate from 'components/tips/tip-template'
import {serverClient} from 'app/_trpc/serverClient'

export default async function Tip({params}: {params: {tipId: string}}) {
  const tip = await serverClient.tips.bySlug({slug: params.tipId})
  const allTips = await serverClient.tips.all()
  const coursesFromTag = await serverClient.tips.relatedContent({
    slug: params.tipId,
  })

  const publishedTips =
    allTips.find((tipGroup) => tipGroup.state === 'published')?.tips ?? []

  return (
    tip && (
      <>
        <TipTemplate
          tip={tip}
          tips={publishedTips}
          coursesFromTag={coursesFromTag}
        />
      </>
    )
  )
}
