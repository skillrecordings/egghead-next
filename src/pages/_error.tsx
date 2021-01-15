import * as React from 'react'
import Image from 'next/image'
import {NextPage} from 'next'

type Props = {
  statusCode?: number
}

const Error: NextPage<Props> = ({statusCode}) => {
  return (
    <div className="flex items-center justify-center space-x-10 mb-60">
      <div className="flex items-center">
        <Image
          src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1610722602/next.egghead.io/pages/broken-eggo.png"
          width={691}
          height={493}
        />
        <div className="flex flex-col max-w-md">
          <h1 className="font-extrabold text-9xl">
            {statusCode ? statusCode : 'Error'}
          </h1>
          <p>
            An error has occurred and it is entirely our fault. Can you please
            click the feedback above and give us any details about what you were
            trying to view. Sorry for the hassle :/
          </p>
        </div>
      </div>
    </div>
  )
}

Error.getInitialProps = ({res, err}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return {statusCode}
}

export default Error
