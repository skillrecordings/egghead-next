import {useRouter} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'

export const TipTeaser: React.FC<{tip: any}> = ({tip}) => {
  const {title, muxPlaybackId} = tip
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`
  const router = useRouter()

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
    </article>
  )
}
