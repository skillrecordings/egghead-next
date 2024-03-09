import {getAllTips, Tip} from '@/lib/tips'
import TipCard from '@/components/tips/tip-card'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'

const TipsIndex: React.FC<any> = async () => {
  const publishedTips = await getAllTips({onlyPublished: true})

  return (
    <>
      <header className="dark:bg-gray-1000 bg-gray-50 mb-8 pb-8 border-b border-gray-200  dark:border-gray-800">
        <div className="max-w-screen-lg mx-auto flex sm:flex-row flex-col-reverse w-full justify-between items-center space-y-3 ">
          <div>
            <h1 className="text-4xl font-semibold text-center sm:text-left">
              Tips
            </h1>
            <h2 className="prose dark:prose-invert prose-lg text-center sm:text-left max-w-xl pt-10">
              <Balancer>
                A collection of web development tips from professional software
                engineers
              </Balancer>
            </h2>
          </div>
          <Image
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1709922099/js-eggo-planet-const.png"
            alt="eggo opening up a javascript planet"
            width={400}
            height={400}
          />
        </div>
      </header>

      <main className="max-w-screen-lg mx-auto relative z-10 flex flex-col items-center justify-center pb-16">
        <div className="flex w-full flex-col gap-0 sm:gap-3">
          {publishedTips
            .filter(({state}) => state === 'published')
            .map((tip, i) => {
              return <TipCard tip={tip} key={tip.slug} i={i} />
            })}
        </div>
      </main>
    </>
  )
}

export default TipsIndex
