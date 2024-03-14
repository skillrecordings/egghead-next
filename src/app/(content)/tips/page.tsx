import {Suspense} from 'react'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import TipList from './_components/tips-lists'
import Icon from '@/components/icons/tip-icons'

const TipsIndex: React.FC<any> = async () => {
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
          <Suspense fallback={<Skeleton />}>
            <TipList />
          </Suspense>
        </div>
      </main>
    </>
  )
}

const Skeleton = () => {
  return (
    <div className="animate-pulse h-full flex flex-col gap-2 ">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  )
}
const SkeletonRow = () => {
  return (
    <div className="flex items-center h-[160px] w-screen lg:w-[1024px] rounded border dark:border-gray-700 px-4 py-2">
      <div
        role="status"
        className="hidden sm:block h-[112px] w-[200px] bg-gray-200 dark:bg-gray-700 border-gray-200 rounded shadow"
      >
        <div className="flex-col space-y-1.5 p-6 relative hidden aspect-video w-full max-w-[100px] items-center justify-center sm:flex sm:max-w-[200px]">
          <div
            className="absolute flex items-center justify-center rounded-full text-white opacity-100 drop-shadow-xl duration-500 ease-in-out group-hover:opacity-100"
            aria-hidden="true"
          >
            <Icon
              className="h-6 w-6 duration-500 ease-in-out sm:group-hover:scale-110 text-gray-200 dark:text-gray-600"
              name="Playmark"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-6 py-4">
        <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-52 lg:w-80"></div>
        <div className="flex items-center">
          <svg
            className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
          <div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
            <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="h-2 bg-gray-200 sm:w-80 lg:w-[500px] rounded-full dark:bg-gray-700"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
    </div>
  )
}

export default TipsIndex
