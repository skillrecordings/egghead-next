import {getAllTips, getTip, getCoursesRelatedToTip} from 'lib/tips'
import TipTemplate from 'components/tips/tip-template'

export default async function Tip({params}: {params: {tipId: string}}) {
  const tip = await getTip(params.tipId)
  const tips = await getAllTips()
  const coursesFromTag = await getCoursesRelatedToTip(params.tipId)

  return (
    tip && (
      <>
        <TipTemplate tip={tip} tips={tips} coursesFromTag={coursesFromTag} />
      </>
    )
  )
}
