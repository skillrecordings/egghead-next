import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import Image from 'next/image'
import {NextSeo} from 'next-seo'
import DefaultCTA from '../curated/default-cta'
import analytics from 'utils/analytics'

type InstructorProps = {
  className?: string
  instructor: any
  socials?: any
  CTAComponent?: React.ReactElement | React.FC
}

const SearchInstructorEssential: FunctionComponent<InstructorProps> = ({
  children,
  className,
  CTAComponent,
  instructor,
  socials,
}) => {
  const {
    avatar_url: imageUrl,
    slug,
    twitter: twitterHandle,
    bio_short,
    full_name: name,
    website: websiteUrl,
    company,
    bio,
  } = instructor

  console.log({socials, slug})

  const location = `${name} landing`
  return (
    <div className="lg:pb-4 -mx-5">
      <NextSeo
        title={`Learn web development from ${name} on egghead`}
        twitter={{
          handle: twitterHandle,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title: `Learn web development from ${name} on egghead`,
          images: [
            {
              url: `http://og-image-react-egghead.now.sh/instructor/${slug}?v=20201103`,
            },
          ],
        }}
      />
      <div className="items-center flex flex-col grid-cols-1 space-y-12 lg:grid lg:grid-cols-12 lg:space-y-0 dark:bg-gray-900">
        <div
          className={`w-full lg:col-span-8 dark:text-gray-200 h-full relative items-start overflow-hidden grid lg:grid-cols-8 lg:gap-2 ${
            className ? className : ''
          }`}
        >
          {imageUrl && (
            <div className="relative flex flex-col justify-start h-full lg:col-span-3 lg:min-h-[350px] xl:min-h-[400px]">
              <Image
                quality="100"
                layout="fill"
                src={imageUrl}
                className="object-cover object-top w-full h-full shadow"
                alt={name}
              />
            </div>
          )}
          <div className="flex flex-col justify-start h-full p-8 lg:col-span-5">
            {company && (
              <p className="text-xs text-gray-500 uppercase">{company}</p>
            )}
            <h1 className="text-2xl font-extrabold sm:text-3xl">{name}</h1>
            <div className="mt-2">
              <ul className="flex space-x-5">
                {twitterHandle && (
                  <li>
                    <a
                      href={`http://twitter.com/${twitterHandle}`}
                      className="text-gray-400 hover:text-gray-500"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        analytics.events.activityExternalLinkClick(
                          slug,
                          'Instructor Profile',
                          'social',
                          `http://twitter.com/${twitterHandle}`,
                        )
                      }}
                    >
                      <span className="sr-only">Twitter</span>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>
                )}
                {socials?.github && (
                  <li>
                    <a
                      href={socials?.github.url}
                      className="text-gray-400 hover:text-gray-500  m-0"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        analytics.events.activityExternalLinkClick(
                          slug,
                          'Instructor Profile',
                          'social',
                          socials.github.url,
                        )
                      }}
                    >
                      <span className="sr-only">GitHub</span>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 25 25"
                        aria-hidden="true"
                      >
                        <title>GitHub</title>
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </a>
                  </li>
                )}
                {socials?.linkedin && (
                  <li>
                    <a
                      href={socials?.linkedin.url}
                      className="text-gray-400 hover:text-gray-500  m-0"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        analytics.events.activityExternalLinkClick(
                          slug,
                          'Instructor Profile',
                          'social',
                          socials.linkedin.url,
                        )
                      }}
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg
                        className="w-7 h-5"
                        fill="currentColor"
                        viewBox="0 0 25 25"
                        aria-hidden="true"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </li>
                )}
                {socials?.discord && (
                  <li>
                    <a
                      href={socials?.discord.url}
                      className="text-gray-400 hover:text-gray-500  m-0"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        analytics.events.activityExternalLinkClick(
                          slug,
                          'Instructor Profile',
                          'social',
                          socials?.discord.url,
                        )
                      }}
                    >
                      <span className="sr-only">Discord</span>
                      <svg
                        className="w-7 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                      </svg>
                    </a>
                  </li>
                )}
                {socials?.youtube && (
                  <li>
                    <a
                      href={socials?.youtube.url}
                      className="text-gray-400 hover:text-gray-500  m-0"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        analytics.events.activityExternalLinkClick(
                          slug,
                          'Instructor Profile',
                          'social',
                          socials?.youtube.url,
                        )
                      }}
                    >
                      <span className="sr-only">YouTube</span>
                      <svg
                        className="w-7 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  </li>
                )}
                {websiteUrl && (
                  <li>
                    <a
                      href={websiteUrl}
                      className="text-gray-400 hover:text-gray-500"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        analytics.events.activityExternalLinkClick(
                          slug,
                          'Instructor Profile',
                          'social',
                          websiteUrl,
                        )
                      }}
                    >
                      <span className="sr-only">Website</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {(bio || bio_short) && (
              <Markdown className="pt-2 mt-2 text-sm prose text-gray-800 dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:text-base leading-thight dark:text-gray-200 md:mt-8">
                {bio || bio_short}
              </Markdown>
            )}
          </div>
        </div>
        {CTAComponent ? CTAComponent : <DefaultCTA location={location} />}
      </div>
      {children}
    </div>
  )
}

export default SearchInstructorEssential
