'use client'
import Image from 'next/image'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'

const BlockedComponent = () => {
  let searchParams = useSearchParams()
  const prevPath = searchParams?.get('prevPath')

  return (
    <>
      <h1 className="sr-only">Blocked from too many requests</h1>
      <div className="h-screen flex self-center items-center justify-center gap-4 ">
        <Image
          src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1659039546/eggodex/basic_eggo.png"
          alt="egghead search error"
          width={350}
          height={350}
        />
        <div>
          <p className="prose dark:prose-dark text-xl">
            You've sent too many requests.
          </p>
          <p className="prose dark:prose-dark text-xl">
            Please wait 60 seconds and try again.
          </p>
          {prevPath && (
            <Link href={prevPath} className="text-blue-500 underline text-lg">
              Return to previous page
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default BlockedComponent
