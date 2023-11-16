import {useRouter} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'
import {
  CheckCircleIcon as CheckCircleIconOutline,
  ArrowsExpandIcon,
} from '@heroicons/react/outline'
import {CheckCircleIcon, CheckIcon} from '@heroicons/react/solid'
import {trpc} from '@/app/_trpc/client'

export const TipTeaser: React.FC<{tip: any; onClick?: () => void}> = ({
  tip,
}) => {
  const {title, muxPlaybackId} = tip
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`
  const router = useRouter()
  const data = tip?.eggheadRailsLessonId
    ? trpc.tips.loadTipProgress.useQuery({
        id: tip?.eggheadRailsLessonId,
      })
    : {data: {tipCompleted: false}}
  const tipCompleted = data.data?.tipCompleted

  return (
    <article className="flex items-center gap-4 py-3">
      <header className="flex-shrink-0">
        <button
          onClick={() => {
            router.push(`/tips/${tip.slug}`)
          }}
          className="group relative flex items-center justify-center overflow-hidden rounded"
        >
          <span className="sr-only">Play {title} </span>
          <div className="flex w-16 items-center justify-center sm:w-auto">
            <Image
              src={thumbnail}
              alt=""
              width={240 / 2}
              height={135 / 2}
              aria-hidden="true"
              className=" brightness-75 transition duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
          <div
            className="absolute flex scale-50 items-center justify-center text-white opacity-100 transition"
            aria-hidden="true"
          ></div>
        </button>
      </header>
      <h2 className="font-bold  sm:text-lg">
        <Link
          href={`/tips/${tip.slug}`}
          className="inline-flex items-start gap-1 leading-tight hover:underline"
        >
          <Balancer>{title}</Balancer>{' '}
        </Link>
      </h2>
      {tipCompleted ? (
        <span className="self-center">
          <CheckCircleIcon className="h-5 w-5 text-green-500  rounded-full" />
        </span>
      ) : (
        <span className="self-center ">
          <CheckCircleIconOutline className="h-5 w-5 text-gray-300" />
        </span>
      )}
    </article>
  )
}
