import React, {FunctionComponent} from 'react'
import Link from 'next/link'

type CreateAccountCTAProps = {}

const CreateAccountCTA: FunctionComponent<CreateAccountCTAProps> = () => {
  return (
    <div className="flex flex-col items-center px-5">
      <h2 className="sm:text-2xl text-xl leading-tighter tracking-tight font-light text-center max-w-sm">
        This lesson is <strong className="font-bold">free to watch</strong>.
      </h2>
      <Link href="/login">
        <a className="mt-8 text-white py-3 px-5 rounded-md text-base font-semibold bg-blue-600 hover:bg-indigo-600 hover:shadow-xl transition-all ease-in-out duration-300 hover:scale-105 transform">
          Click here to Create an account or Login to view
        </a>
      </Link>
    </div>
  )
}

export default CreateAccountCTA
