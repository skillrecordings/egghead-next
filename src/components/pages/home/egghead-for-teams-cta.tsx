import * as React from 'react'
import {FunctionComponent} from 'react'
import Image from 'next/image'
import Link from 'next/link'

const EggheadForTeamsCta: FunctionComponent = () => {
  return (
    <section className=" mb-16">
      <Link href="/egghead-for-teams">
        <div className="min-w-[24em] w-fit mx-auto cursor-pointer">
          <div className="dark:bg-gray-500 bg-slate-200 rounded p-[1px] transition-all hover:animate-gradient-xy hover:bg-gradient-to-br hover:from-amber-400 hover:via-amber-200 hover:to-yellow-400 ">
            <div className="relative justify-items-center md:w-[46rem] shrink-0 grid grid-cols-1 md:grid-cols-6 rounded gap-4 p-8 dark:bg-gray-800 bg-white">
              <div className="absolute -right-2 -top-2 h-32 w-32 overflow-hidden rounded-sm">
                <div className="absolute top-0 left-[14px] h-2 w-2 bg-amber-500 after:-z-10"></div>
                <div className="absolute right-0 bottom-[14px] h-2 w-2 bg-amber-500"></div>
                <a
                  className="absolute bottom-16 -right-12 rotate-45  w-[141.42%] rounded-sm px-5 py-2 
              text-sm font-semibold uppercase tracking-wide text-center shadow-lg text-amber-800
              bg-gradient-to-br from-amber-300 via-amber-100 to-yellow-300 animate-gradient-xy hover:from-amber-400 hover:via-amber-200 hover:to-yellow-400"
                >
                  For Teams
                </a>
              </div>
              <div className="flex-shrink-0 relative flex items-center justify-center w-[240px] lg:w-[300px] xl:w-[360px] col-span-2">
                <Image
                  alt="eggos climbing mountain self-center"
                  className="hover:scale-95 transition-all"
                  height={237}
                  width={226}
                  src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1682701917/eggodex/egh_climbers.png"
                />
              </div>
              <div className="flex flex-col shrink-0 md:col-span-4 space-y-4 md:w-[42ch] p-4">
                <h2 className="text-lg lg:text-2xl sm:text-xl font-bold">
                  egghead for Teams
                </h2>
                <p className=" text-amber-600 dark:text-amber-300 font-medium hidden md:block">
                  Keeping your team up to date and consistent with the
                  application of frameworks, patterns, and best practices is an
                  ongoing and extreme challenge for any organization.
                </p>
                <ul className="grid md:grid-cols-4 gap-2 my-8">
                  <li className="md:col-span-2">
                    <span className="text-amber-300 font-bold">✓</span> high
                    quality product development
                  </li>
                  <li className="md:col-span-2">
                    <span className="text-amber-300 font-bold">✓</span>{' '}
                    understanding around "how we got here"
                  </li>
                  <li className="md:col-span-2">
                    <span className="text-amber-300 font-bold">✓</span> shared
                    knowledge and understanding of tools
                  </li>
                  <li className="md:col-span-2">
                    <span className="text-amber-300 font-bold">✓</span>{' '}
                    alignment on best practices
                  </li>
                </ul>
                <button className="mt-4 bg-amber-300 text-amber-800 hover:bg-yellow-300 py-3 px-4 rounded-xl font-bold bg-gradient-to-br from-amber-300 via-amber-100 to-yellow-300 animate-gradient-xy hover:from-amber-400 hover:via-amber-200 hover:to-yellow-400">
                  Level Up Your Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  )
}

export default EggheadForTeamsCta
