import Link from 'next/link'
import React from 'react'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from 'utils/auth'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import {useViewer} from 'context/viewer-context'
import get from 'lodash/get'
import Eggo from 'components/icons/eggo'
import Image from 'next/image'
import {Viewer} from 'types'

const DiscordPage: React.FC<React.PropsWithChildren<LoginRequiredParams>> = ({
  loginRequired,
}) => {
  const {viewer} = useViewer()
  const name = get(viewer, 'name', '')

  return (
    <LoginRequired loginRequired={loginRequired}>
      {process.env.NEXT_PUBLIC_DISCORD_AUTHORIZE && (
        <div className="flex flex-col flex-grow sm:pt-16 pt-8 sm:pb-32 pb-16 px-5 w-full items-center justify-center min-h-[calc(100vh-48px)]">
          <HeaderImage viewer={viewer} />
          <h1 className="md:text-2xl text-xl leading-tight font-semibold text-center pt-8 lg:max-w-none max-w-lg">
            <span className="font-normal sm:text-lg text-base inline-block pb-4">
              Hey {name}{' '}
              <span role="img" aria-label="waving hand">
                👋
              </span>
            </span>
            <br />
            You are invited to join egghead community on Discord!{' '}
            <span role="img" aria-label="confetti">
              🎉
            </span>
          </h1>
          <p className="sm:text-base text-sm text-center opacity-80 font-light pt-4 pb-10">
            This will authorize egghead to see your Discord identity and email.
            {/* If you are currently logged in and a PRO member of egghead you will
            be invited added to the egghead Discord server as a member. If you
            aren't a PRO member, you will still be added to the server. */}
          </p>

          <Link href={process.env.NEXT_PUBLIC_DISCORD_AUTHORIZE}>
            <a
              className={`flex gap-5 rounded-md text-white items-center bg-[#5865F2] justify-center pl-5 leading-3 overflow-hidden font-medium hover:bg-opacity-90 transition`}
            >
              <span className="py-1">Join egghead on Discord</span>
              <span className="bg-black bg-opacity-10 px-5 py-5" aria-hidden>
                <DiscordLogo />
              </span>
            </a>
          </Link>
        </div>
      )}
    </LoginRequired>
  )
}

const HeaderImage: React.FC<React.PropsWithChildren<{viewer: Viewer}>> = ({
  viewer,
}) => {
  const avatar = viewer.avatar_url.includes('gravatar')
    ? null
    : viewer.avatar_url

  return (
    <div
      role="img"
      aria-label="egghead community on discord"
      className="outline-2 outline-dotted dark:outline-white/20 outline-black/20 p-5 rounded-full aspect-1 border dark:border-gray-600 border-gray-400 relative bg-gradient-to-tr dark:from-white/10 dark:to-white/0 from-gray-200/50 to-gray-100/50"
    >
      <Eggo className="w-14" />
      {avatar && (
        <div
          className={`rounded-full absolute -bottom-3 right-5 mr-0.5 overflow-hidden flex`}
        >
          <Image src={avatar} alt={viewer.name} width={24} height={24} />
        </div>
      )}
      <div
        className={`absolute -bottom-1 -right-1 aspect-1 p-2 flex items-center justify-center rounded-full bg-[#5865F2] drop-shadow-xl`}
      >
        <DiscordLogo className="w-4 text-white" />
      </div>
    </div>
  )
}

const DiscordLogo: React.FC<React.PropsWithChildren<{className?: string}>> = ({
  className = 'w-5',
}) => (
  <svg
    className={className}
    viewBox="0 0 71 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0)">
      <path
        d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="71" height="55" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default DiscordPage

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  const {loginRequired} = getTokenFromCookieHeaders(
    req.headers.cookie as string,
  )

  return {
    props: {
      loginRequired,
    },
  }
}
