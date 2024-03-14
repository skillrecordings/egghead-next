import TipCard from '@/components/tips/tip-card'
import {getAllTips} from '@/lib/tips'

const TipList: React.FC<any> = async () => {
  const publishedTips = await getAllTips({onlyPublished: true})

  return (
    <>
      {publishedTips
        .filter(({state}) => state === 'published')
        .map((tip, i) => {
          return <TipCard tip={tip} key={tip.slug} i={i} />
        })}
    </>
  )
}

export default TipList
