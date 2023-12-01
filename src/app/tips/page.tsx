import {getAllTips, Tip} from '@/lib/tips'
import TipCard from '@/components/tips/tip-card'
import Balancer from 'react-wrap-balancer'

const TipsIndex: React.FC<any> = async () => {
  const publishedTips = await getAllTips({onlyPublished: true})

  return (
    <>
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 px-5 py-16 text-center">
        <h1 className="mx-auto text-center text-4xl font-semibold">Tips</h1>
        <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-500">
          <Balancer>these are tips for you.</Balancer>
        </h2>
      </header>
      <main className="relative z-10 flex flex-col items-center justify-center pb-16">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-5 px-5 md:grid-cols-2 lg:grid-cols-3">
          {publishedTips
            .filter(({state}) => state === 'published')
            .map((tip) => {
              return <TipCard tip={tip} key={tip.slug} />
            })}
        </div>
      </main>
    </>
  )
}

export default TipsIndex
