import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Markdown from 'react-markdown'
import Topic from 'components/search/components/topic'
import Image from 'next/image'
import Link from 'next/link'

type LandingProps = {
  course: any
}

const landingPage: FunctionComponent<LandingProps> = () => {
  const course = {
    id: '418892',
    title: 'Build a Developer Blog with Gatsby',
    path: '/courses/build-a-developer-blog-with-gatsby-bd96',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/425/621/full/developer_blog_1000_2x.png',
    resources: [
      {
        title: 'Use npm init gatsby to create an initial Gatsby site',
        slug: 'gatsby-use-npm-init-gatsby-to-create-an-initial-gatsby-site',
        path:
          '/lessons/gatsby-use-npm-init-gatsby-to-create-an-initial-gatsby-site',
      },
      {
        title: 'Add a Shared Layout Component to a Gatsby Site',
        slug: 'gatsby-add-a-shared-layout-component-to-a-gatsby-site',
        path: '/lessons/gatsby-add-a-shared-layout-component-to-a-gatsby-site',
      },
      {
        title: 'Create an Accessible SEO Component using React Helmet',
        slug: 'gatsby-create-an-accessible-seo-component-using-react-helmet',
        path:
          '/lessons/gatsby-create-an-accessible-seo-component-using-react-helmet',
      },
      {
        title: 'Use Gatsby Plugins to Source and Transform MDX Files',
        slug: 'gatsby-use-gatsby-plugins-to-source-and-transform-mdx-files',
        path:
          '/lessons/gatsby-use-gatsby-plugins-to-source-and-transform-mdx-files',
      },
      {
        title: `Use Gatsby's File System Route API to Generate Pages for Each MDX File`,
        slug:
          'gatsby-use-gatsby-s-file-system-route-api-to-generate-pages-for-each-mdx-file',
        path:
          '/lessons/gatsby-use-gatsby-s-file-system-route-api-to-generate-pages-for-each-mdx-file',
      },
      {
        title: 'Use MDXRenderer to Render MDX Content in a Gatsby Site',
        slug: 'gatsby-use-mdxrenderer-to-render-mdx-content-in-a-gatsby-site',
        path:
          '/lessons/gatsby-use-mdxrenderer-to-render-mdx-content-in-a-gatsby-site',
      },
      {
        title: 'Add a List of Posts using a GraphQL Page Query',
        slug: 'gatsby-add-a-list-of-posts-using-a-graphql-page-query',
        path: '/lessons/gatsby-add-a-list-of-posts-using-a-graphql-page-query',
      },
      {
        title:
          'Add Theme UI to a Gatsby Site using gatsby-plugin-theme-ui and theme-ui',
        slug:
          'gatsby-add-theme-ui-to-a-gatsby-site-using-gatsby-plugin-theme-ui-and-theme-ui',
        path:
          '/lessons/gatsby-add-theme-ui-to-a-gatsby-site-using-gatsby-plugin-theme-ui-and-theme-ui',
      },
      {
        title:
          'Add Support for Syntax Highlighting in a Gatsby Site with @theme-ui/prism',
        slug:
          'gatsby-add-support-for-syntax-highlighting-in-a-gatsby-site-with-theme-ui-prism',
        path:
          '/lessons/gatsby-add-support-for-syntax-highlighting-in-a-gatsby-site-with-theme-ui-prism',
      },
      {
        title: 'Render Performant Images with the Gatsby StaticImage Component',
        slug:
          'gatsby-render-performant-images-with-the-gatsby-staticimage-component',
        path:
          '/lessons/gatsby-render-performant-images-with-the-gatsby-staticimage-component',
      },
      {
        title: 'Process Images and Render them using GatsbyImage',
        slug: 'gatsby-process-images-and-render-them-using-gatsbyimage',
        path:
          '/lessons/gatsby-process-images-and-render-them-using-gatsbyimage',
      },
      {
        title: 'Add Image Support to SEO Component',
        slug: 'gatsby-add-image-support-to-seo-component',
        path: '/lessons/gatsby-add-image-support-to-seo-component',
      },
    ],
  }

  return (
    <>
      <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto">
        <div className="mt-10 mb-16 text-center">
          <div className="mb-10">
            <Image priority src={course.image} height="270" width="270" />
          </div>
          <p className="text-lg md:text-2xl leading-6 text-gray-500">
            Portfolio Project Challenge
          </p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            {course.title}
          </h1>
        </div>
        <ProjectBrief
          className="pb-12"
          topic={{
            name: 'gatsby',
            label: 'Project Brief',
          }}
        >
          <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0">
            {`As a developer, your GitHub is a huge step up from a bullet point list of buzzwords on a resume. However, your repos alone don't give much room to provide additional context around the other aspects of web development. 

Your task is to use Gatsby to **build a portfolio site** that features your case studies. Make it performant and accessible out of the box, add SEO support so potential employers can find you with a quick search.

You can make this site using MDX, or stretch yourself a bit by relying on reusable React components and passing things via props. Both are great approaches to use inside Gatsby.

If you more ideas about what to include in your portfolio, check out [this article by Joel Hooks](https://joelhooks.com/developer-portfolio).`}
          </Markdown>
        </ProjectBrief>

        <div className="flex justify-center">
          <svg
            width="7"
            height="155"
            viewBox="0 0 7 155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="3.5"
              y1="-1.5299e-07"
              x2="3.50001"
              y2="155"
              stroke="#B0B0B0"
              strokeWidth="7"
              strokeDasharray="10 10"
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 mt-16 mb-16">
          <div className="relative px-10 py-10 bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 col-span-2 shadow rounded-md border border-gray-100 sm:mr-0 md:mr-4">
            <div
              className="absolute rounded-t-lg rounded-b-none left-0 top-4 -mt-5 h-3 w-full bg-gradient-to-r"
              style={{
                background:
                  'linear-gradient(to right, #7b47a3 0%, #9290ff 100%)',
              }}
            />
            <h1 className="sm:text-2xl text-xl font-bold mb-2">Performance</h1>
            <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0">
              {`- The individual pages to the case studies need to be programmatically created from your GraphQL data using the File System Route API.
- The index page of your portfolio site needs to include at least 3 case studies.

- GatsbyImage is a React component specially designed to give users a great image experience. It combines speed and best practices. Process images and render them using GatsbyImage on each page.

- MDX is an authorable format that lets you seamlessly write JSX in your Markdown documents. Use MDX to process and render the content of each page. 

- Gatsby can help your site rank and perform better in search engines. Some advantages, like speed, come out of the box and others require configuration. Add SEO support to your portfolio.

`}
            </Markdown>
          </div>
          <div className="relative px-10 py-10 bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 col-span-1 shadow rounded-md border border-gray-100 mt-4 md:mt-0">
            <div
              className="absolute rounded-t-lg rounded-b-none left-0 top-4 -mt-5 h-3 w-full bg-gradient-to-r"
              style={{
                background:
                  'linear-gradient(to right, #938cff 0%, #8440a8 100%)',
              }}
            />
            <h1 className="sm:text-2xl text-xl font-bold mb-2">Standards</h1>
            <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0">
              {`- The application uses Gatsby.

- The application contains minimal bugs.

- The application is deployed to the web and is useable for its intended purpose.

- The application is accessible.`}
            </Markdown>
          </div>
        </div>

        <div className="flex justify-center">
          <svg
            width="7"
            height="155"
            viewBox="0 0 7 155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="3.5"
              y1="-1.5299e-07"
              x2="3.50001"
              y2="155"
              stroke="#B0B0B0"
              strokeWidth="7"
              strokeDasharray="10 10"
            />
          </svg>
        </div>

        <div className="relative bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 shadow rounded-md border border-gray-100 mt-16 mb-16 px-10 py-10">
          <div
            className="absolute rounded-t-lg rounded-b-none left-0 top-4 -mt-5 h-3 w-full bg-gradient-to-r"
            style={{
              background: 'linear-gradient(to right, #7b47a3 0%, #9290ff 100%)',
            }}
          />
          <h1 className="sm:text-2xl text-xl font-bold mb-2 text-center">
            Course Content
          </h1>

          <div className="max-w-screen-sm m-auto pb-4">
            <ul className="mt-10">
              {course?.resources?.map((lesson: any) => {
                return (
                  <li key={`${course.path}::${lesson.slug}`}>
                    <div className="flex items-center leading-tight py-2">
                      <Link href={lesson.path}>
                        <a className="py-1 flex space-x-2 items-center dark:text-gray-100 text-gray-700 hover:text-blue-600 group">
                          {/* prettier-ignore */}
                          <div className="flex-shrink-0"><svg className="text-gray-400 dark:text-gray-400 group-hover:text-blue-600" width={18} height={18} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664l-3-2z" fill="currentColor"/></g></svg></div>
                          <Markdown className="prose dark:prose-dark md:dark:prose-lg-dark md:prose-lg text-gray-700 dark:text-gray-100 mt-0 text-base md:text-lg">
                            {lesson.title}
                          </Markdown>
                        </a>
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className="flex justify-center">
          <svg
            width="7"
            height="155"
            viewBox="0 0 7 155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="3.5"
              y1="-1.5299e-07"
              x2="3.50001"
              y2="155"
              stroke="#B0B0B0"
              strokeWidth="7"
              strokeDasharray="10 10"
            />
          </svg>
        </div>
        <div>
          <div className="mt-10 text-center pb-12">
            <h1 className="text-2xl md:text-4xl font-bold pb-4">
              Did you complete the Portfolio Project Challenge?
            </h1>
            <p className="text-lg md:text-2xl leading-6 text-gray-500">
              Let us know what you built!
            </p>

            <a
              className="inline-flex justify-center items-center px-6 py-4 font-semibold rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200 mt-12"
              title="Share on twitter"
              href="https://twitter.com/intent/tweet?text=I%20completed%20the%20Portfolio%20Project%20Challenge%20on%20%40eggheadio%20🙌"
              rel="noopener"
            >
              Tweet @eggheadio
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export enum CARD_TYPES {
  SUMMARY = 'summary',
  SUMMARY_LARGE_IMAGE = 'summary_large_image',
}

export type Topic = {
  name: string
  label: string
  title?: string
}

type ProjectBriefProps = {
  topic: Topic
  className: any
  pageData?: any
  CTAComponent?: React.FC
  ogImage?: string
  verticalImage?: string
  cardType?: CARD_TYPES
}

const ProjectBrief: React.FC<ProjectBriefProps> = ({
  topic,
  children,
  ogImage,
  className,
  cardType = CARD_TYPES.SUMMARY_LARGE_IMAGE,
}) => {
  const description = `Build a localization engine that renders data based on the Edge location nearest to the application's user using Cloudflare Workers.`

  const title =
    topic.title ||
    `Introduction to Cloudflare Workers - Portfolio Project Challenge`

  return (
    <div className={`xl:px-0 dark:bg-gray-900 ${className ? className : ''}`}>
      <NextSeo
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType,
        }}
        openGraph={{
          title,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url:
                ogImage ||
                `https://og-image-react-egghead.now.sh/topic/${topic.name}?orientation=landscape&v=20201104`,
            },
          ],
        }}
      />
      <div className="md:grid grid-cols-1 gap-5 justify-self-center space-y-5 md:space-y-0 dark:bg-gray-900">
        <div
          className={`bg-white grid grid-cols-8 h-full relative items-center overflow-hidden shadow rounded-md border border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 col-span-8`}
        >
          <div
            className="overflow-hidden sm:col-span-3 col-span-3 w-full h-full"
            style={{
              background: `url(https://og-image-react-egghead.now.sh/topic/${topic.name}?orientation=portrait&v=20201104)`,
              backgroundSize: 'cover',
              backgroundPosition: '38%',
            }}
          />
          <div className="sm:col-span-5 col-span-5 flex flex-col justify-start h-full px-12 py-12 pt-10">
            <h1 className="sm:text-2xl text-xl font-bold mb-2">
              {topic.label}
            </h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default landingPage
