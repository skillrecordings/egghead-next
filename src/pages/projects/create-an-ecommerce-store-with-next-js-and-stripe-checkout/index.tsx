import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import Eggo from '../../../components/images/eggo.svg'
import removeMarkdown from 'remove-markdown'
import {NextSeo} from 'next-seo'
import {track} from 'utils/analytics'
import {first, get} from 'lodash'
import {useViewer} from '../../../context/viewer-context'

type CourseProps = {
  course: any
  dependencies: any
}

const Course: FunctionComponent<CourseProps> = () => {
  const course = {
    title: `Create an eCommerce Store with Next.js and Stripe Checkout`,
    slug: `create-an-ecommerce-store-with-next-js-and-stripe-checkout`,
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608034857/next.egghead.io/pages/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout/create-an-ecommerce-store-with-next-js-and-stripe-checkout_1.png',
    summary: `#### Accept payments & sell products powered by Stripe and the best of the JAMStack

There are as many ways to build an e-commerce store on the internet as there are products to sell. 
One thing is for certain, e-commerce is here to stay and as professional developers we need to understand
how to build fully custom stores for our clients using the best modern tools available.

* React: flexible and customizable while following modern best practices
* Next.js: lightening fast with guide rails to help your project perform like consumers expect
* Stripe Checkout: let's you offload reams of complicated business logic to a trusted third party
that maintains regulatory compliance, global payments, and a standard UX.

Your store will have well managed local component state using React Hooks and you'll 
also have clear and cohesive shared (global) state with React Context.

Finally you'll deploy your custom store to Vercel (the platform behind Next.js) as well as
how to make your Next.js e-commerce store portable to deploy to other platforms.
`,
    podcast: {
      id: '',
    },
    instructor: {
      name: 'Colby Fayock',
      slug: 'colby-fayock',
      path: '/q/resources-by-colby-fayock',
      bio:
        'Colby is a UX designer and front-end engineer living on the Philly side of Pennsylvania. He got his start in web design customizing his AIM and MySpace pages, and quickly graduated to whole websites for teams and bands. He currently works as a developer advocate for Applitools.',
      twitter: 'colbyfayock',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/366/medium/IMG_7414.JPG',
    },
    tags: [
      {
        title: 'Next.js',
        // prettier-ignore
        image: <svg className="w-6 h-6" width="116" height="100" viewBox="0 0 116 100" fill="#000" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0z" /></svg>,
      },
      {
        title: 'Stripe',
        // prettier-ignore
        image: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="34" viewBox="0 0 24 34"><path fill="#6772E5" fillRule="evenodd" d="M688.562205,565.125275 C688.562205,563.668132 689.771654,563.107692 691.774803,563.107692 C694.647244,563.107692 698.275591,563.967033 701.148031,565.498901 L701.148031,556.718681 C698.011024,555.485714 694.911811,555 691.774803,555 C684.102362,555 679,558.96044 679,565.573626 C679,575.885714 693.362205,574.241758 693.362205,578.687912 C693.362205,580.406593 691.850394,580.967033 689.733858,580.967033 C686.59685,580.967033 682.590551,579.696703 679.415748,577.978022 L679.415748,586.87033 C682.930709,588.364835 686.483465,589 689.733858,589 C697.595276,589 703,585.151649 703,578.463736 C702.962205,567.32967 688.562205,569.30989 688.562205,565.125275 Z" transform="translate(-679 -555)"/></svg>,
      },
    ],
    resources: [
      {
        title: 'Bootstrap a Next.js Ecommerce App',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608205688/next.egghead.io/pages/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout/ecommerce-stripe-icon-2.png',
        // body: `* Create a New React Application with Next.js\n* Add a Grid of Products with Images to a Next.js React App\n* Add and Configure Products in the Stripe Dashboard for an Online Store\n* Dynamically Manage a Grid of Products in an Online Store with a JSON Document\n* Host & Deploy a Next.js React app on Vercel`,
        lessons: [
          {
            slug: `next-js-create-a-new-react-application-with-the-next-js-create-next-app-cli`,
            title:
              'Create a New React Application with the Next.js create-next-app CLI',
            path:
              '/lessons/next-js-create-a-new-react-application-with-the-next-js-create-next-app-cli',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `next-js-add-and-style-a-grid-of-products-with-images-in-a-next-js-react-app`,
            title:
              'Add and Style a Grid of Products with Images in a Next.js React App',
            path:
              '/lessons/next-js-add-and-style-a-grid-of-products-with-images-in-a-next-js-react-app',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `next-js-add-and-configure-products-in-the-stripe-dashboard-for-an-online-store`,
            title:
              'Add and Configure Products in the Stripe Dashboard for an Online Store',
            path:
              '/lessons/next-js-add-and-configure-products-in-the-stripe-dashboard-for-an-online-store',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `javascript-dynamically-manage-a-grid-of-products-in-an-online-store-with-a-json-document`,
            title:
              'Dynamically Manage a Grid of Products in an Online Store with a JSON Document',
            path:
              '/lessons/javascript-dynamically-manage-a-grid-of-products-in-an-online-store-with-a-json-document',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/square_280/javascriptlang.png',
          },
          {
            slug: `next-js-host-deploy-a-next-js-react-app-on-vercel-imported-from-github`,
            title:
              'Host & Deploy a Next.js React App on Vercel imported from GitHub',
            path:
              '/lessons/next-js-host-deploy-a-next-js-react-app-on-vercel-imported-from-github',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
        ],
      },
      {
        title: 'Integrate Stripe Checkout into Next.js',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608205688/next.egghead.io/pages/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout/ecommerce-stripe-icon-3.png',
        lessons: [
          {
            slug: `stripe-configure-a-stripe-checkout-domain-for-client-only-integration`,
            title:
              'Configure a Stripe Checkout Domain for Client-Only Integration',
            path:
              '/lessons/stripe-configure-a-stripe-checkout-domain-for-client-only-integration',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/294/square_280/Artboard.png',
          },
          {
            slug: `next-js-add-a-stripe-api-key-as-an-environment-variable-in-next-js-vercel`,
            title:
              'Add a Stripe API Key as an Environment Variable in Next.js & Vercel',
            path:
              '/lessons/next-js-add-a-stripe-api-key-as-an-environment-variable-in-next-js-vercel',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `stripe-integrate-stripe-checkout-to-purchase-products-in-next-js-with-stripe-stripe-stripe-js-cl`,
            title:
              'Integrate Stripe Checkout to Purchase Products in Next.js with Stripe @stripe/stripe-js Cl',
            path:
              '/lessons/stripe-integrate-stripe-checkout-to-purchase-products-in-next-js-with-stripe-stripe-stripe-js-cl',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/294/square_280/Artboard.png',
          },
        ],
      },
      {
        title: 'Manage Shopping Cart State',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608205688/next.egghead.io/pages/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout/ecommerce-stripe-icon-1.png',
        lessons: [
          {
            slug: `react-create-a-shopping-cart-with-the-usestate-react-hook-to-manage-product-quantity-and-total`,
            title:
              'Create a Shopping Cart with the useState React Hook to Manage Product Quantity and Total',
            path:
              '/lessons/react-create-a-shopping-cart-with-the-usestate-react-hook-to-manage-product-quantity-and-total',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_280/react.png',
          },
          {
            slug: `react-create-a-custom-react-hook-to-manage-cart-state`,
            title: 'Create a Custom React Hook to Manage Cart State',
            path:
              '/lessons/react-create-a-custom-react-hook-to-manage-cart-state',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_280/react.png',
          },
          {
            slug: `react-use-the-react-context-api-to-globally-manage-cart-state-in-a-next-js-app`,
            title:
              'Use the React Context API to Globally Manage Cart State in a Next.js App',
            path:
              '/lessons/react-use-the-react-context-api-to-globally-manage-cart-state-in-a-next-js-app',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_280/react.png',
          },
          {
            slug: `react-store-and-load-cart-state-from-local-storage-to-persist-cart-data-when-reloading-the-page`,
            title:
              'Store and Load Cart State from Local Storage to Persist Cart Data When Reloading the Page',
            path:
              '/lessons/react-store-and-load-cart-state-from-local-storage-to-persist-cart-data-when-reloading-the-page',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_280/react.png',
          },
          {
            slug: `next-js-use-next-js-dynamic-routes-to-create-product-pages-for-an-online-store`,
            title:
              'Use Next.js Dynamic Routes to Create Product Pages for an Online Store',
            path:
              '/lessons/next-js-use-next-js-dynamic-routes-to-create-product-pages-for-an-online-store',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `next-js-create-a-shopping-cart-page-to-manage-products-to-purchase-in-a-next-js-app`,
            title:
              'Create a Shopping Cart Page to Manage Products to Purchase in a Next.js App',
            path:
              '/lessons/next-js-create-a-shopping-cart-page-to-manage-products-to-purchase-in-a-next-js-app',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `react-add-a-quantity-input-to-the-cart-page-to-add-or-remove-items-from-a-shopping-cart-in-next`,
            title:
              'Add a Quantity Input to the Cart Page to Add or Remove Items from a Shopping Cart in Next',
            path:
              '/lessons/react-add-a-quantity-input-to-the-cart-page-to-add-or-remove-items-from-a-shopping-cart-in-next',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_280/react.png',
          },
        ],
      },
    ],
  }

  return (
    <>
      <NextSeo
        description={removeMarkdown(course.summary)}
        title={course.title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          handle: course.instructor.twitter,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title: course.title,
          // url: http_url,
          description: removeMarkdown(course.summary),
          site_name: 'egghead',
          images: [
            {
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608044328/next.egghead.io/pages/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout/card_2x.png`,
            },
          ],
        }}
      />
      <div>
        <article className="">
          <header className="relative -mx-5 px-5">
            <div className="absolute left-0 top-0 sm:-mt-5 -mt-3 h-3 w-full bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-500" />
            <div className="flex md:flex-row flex-col md:space-x-10 md:space-y-0 space-y-6 items-center md:pb-16 pb-8 md:pt-8 pt-4 max-w-screen-lg mx-auto">
              <div className="flex-shrink-0 mt-8">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={288}
                  height={288}
                  quality={100}
                />
              </div>
              <div className="space-y-3">
                <div className="uppercase font-medium tracking-wide text-xs md:text-left text-center text-pink-600">
                  Portfolio Project
                </div>
                <h1 className="md:text-3xl text-3xl md:text-left text-center font-bold tracking-tight leading-snug pb-6 max-w-screen-sm">
                  {course.title}
                </h1>
                <Tags tags={course.tags} />
              </div>
            </div>
          </header>
          <main>
            <Markdown
              className="prose prose-lg md:prose-xl max-w-screen-md mx-auto"
              source={course.summary}
            />
            <div className="mt-20 bg-gray-50 -mx-5 pt-24 xl:px-0 px-5">
              <div className="max-w-screen-lg mx-auto">
                <div className="mb-4 uppercase font-medium tracking-wide text-sm md:text-left text-center text-blue-600">
                  What You’ll Build for Your Portfolio
                </div>
                <h2 className="sm:text-2xl text-3xl sm:text-left font-semibold text-center leading-tighter pb-12">
                  How to build a start-to-finish dynamic Next.js app
                </h2>
                {course.resources.map((part, idx) => {
                  const isLast = idx === course.resources.length - 1
                  return (
                    <Part
                      key={part.title}
                      part={part}
                      idx={idx}
                      isLast={isLast}
                    />
                  )
                })}
              </div>
            </div>
            <div className="bg-gradient-to-b from-gray-700 to-gray-900 -mx-5 md:pt-24 pt-10 pb-40 xl:px-0 px-5 text-white ">
              <div className="max-w-screen-lg mx-auto grid md:grid-cols-2 grid-cols-1 gap-10 md:text-left text-center">
                <div>
                  {/* <div className="mb-2 uppercase font-medium tracking-wide text-sm md:text-left text-center text-purple-300">
                    What You’ll Build for Your Portfolio
                  </div> */}
                  <p className="text-xl mt-4 max-w-md md:mx-0 mx-auto">
                    By the end of this project, you’ll have your own dynamic
                    eCommerce store with a working checkout flow.
                  </p>
                  <ul className="text-blueGray-200 mt-6 leading-10 list-none list-inside text-lg font-light">
                    {[
                      'Manage local state with React Hooks',
                      'Manage global state with React Context',
                      'Purchasing flow with Stripe Checkout',
                    ].map((i) => (
                      <li className="space-x-4" key={i}>
                        <span className="text-purple-300">✓</span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:row-start-auto row-start-1">
                  <Image
                    className="rounded-md shadow-lg"
                    src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608034859/next.egghead.io/pages/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout/screenshot-of-space-jelly-shop-interface.png"
                    width={1128 / 2}
                    height={698 / 2}
                    alt="a screenshot of space jelly shop interface"
                  />
                </div>
              </div>
              <div className="mt-16 font-light text-purple-300 grid md:grid-cols-5 grid-cols-2 lg:grid-rows-2 text-center max-w-screen-lg mx-auto md:gap-x-12 gap-x-3 md:gap-y-6 gap-y-5 tracking-wide">
                {[
                  'React Context API',
                  'Data Fetching',
                  'React useState',
                  'Custom React Hooks',
                  'Stripe Integration',
                  'Manage API keys',
                  'Pre-rendering',
                  'Dynamic Routing',
                  'CSS Grid',
                  'Vercel deploys',
                ].map((i) => (
                  <div className="" key={i}>
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </main>
        </article>
        <div className="w-full mx-auto max-w-screen-lg items-center grid md:grid-cols-2 lg:gap-40 md:gap-24 gap-5">
          <Instructor instructor={course.instructor} />
          {course.podcast.id && (
            <div>
              <h3 className="text-lg font-semibold mb-2 md:text-left text-center">
                Listen to Colby tell you about this Portfolio Project
              </h3>
              <iframe
                title="project podcast"
                height="52px"
                width="100%"
                frameBorder="no"
                scrolling="no"
                seamless
                src={`https://player.simplecast.com/${course.podcast.id}?dark=false`}
              />
            </div>
          )}
        </div>
        <Join />
      </div>
    </>
  )
}

// ——— COMPONENTS

const Join: FunctionComponent = () => {
  const {viewer} = useViewer()
  return (
    <div className="md:mt-24 mt-16 md:py-48 py-24 text-center bg-black text-white -mx-5 xl:px-0 px-5">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center space-y-6">
        <div>
          <Eggo className="w-16" />
        </div>
        <h2 className="lg:text-2xl  text-xl font-semibold leading-tighter max-w-2xl">
          Add this project to your portfolio with your egghead Pro Membership
        </h2>
        {viewer?.is_pro ? (
          <>
            <Link href="/playlists/create-an-ecommerce-store-with-next-js-and-stripe-checkout-562c">
              <a
                onClick={() =>
                  track('clicked project', {
                    project:
                      'create-an-ecommerce-store-with-next-js-and-stripe-checkout',
                  })
                }
                className="px-6 py-4 rounded-lg font-semibold bg-blue-600 text-white transition-all ease-in-out duration-300 hover:scale-105 transform hover:bg-blue-500 hover:shadow-xl"
              >
                Build this E-Commerce Store
              </a>
            </Link>
          </>
        ) : (
          <>
            <div>
              from just <strong>$20/month</strong>
            </div>
            <Link href="/pricing">
              <a
                onClick={() =>
                  track('clicked join CTA', {
                    project:
                      'create-an-ecommerce-store-with-next-js-and-stripe-checkout',
                  })
                }
                className="px-6 py-4 rounded-lg font-semibold bg-blue-600 text-white transition-all ease-in-out duration-300 hover:scale-105 transform hover:bg-blue-500 hover:shadow-xl"
              >
                Build this E-Commerce Store
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

const Instructor: FunctionComponent<{
  instructor: {
    name: string
    bio: string
    path: string
    image: string
    slug: string
  }
}> = ({instructor: {name, bio, path, image, slug}}) => {
  return (
    <div className="flex flex-col space-y-2 md:items-start md:text-left text-center items-center -mt-20">
      <div className="rounded-full bg-white p-1 overflow-hidden">
        <Image
          className="rounded-full"
          src={image}
          width={160}
          height={160}
          alt="Colby Fayock"
        />
      </div>
      <div className="text-xs uppercase text-gray-600">
        Meet Your Instructor
      </div>
      <Link href={path}>
        <a
          onClick={() => {
            track(`clicked instructor profile link`, {
              project:
                'create-an-ecommerce-store-with-next-js-and-stripe-checkout',
              instructor: slug,
            })
          }}
          className="text-lg font-semibold"
        >
          {name}
        </a>
      </Link>
      <Markdown className="prose max-w-xl" source={bio} />
    </div>
  )
}

const Tags: FunctionComponent<{
  tags: {title: string; image: React.ReactElement}[]
}> = ({tags}) => {
  return (
    <div className="flex space-x-6 items-center md:justify-start justify-center">
      {tags.map((tag) => (
        <div key={tag.title} className="flex space-x-1 items-center">
          {tag.image}
          <span>{tag.title}</span>
        </div>
      ))}
    </div>
  )
}

const Part: FunctionComponent<{
  part: {
    title: string
    body?: string
    image: string
    lessons?: {title: string; path: string; slug: string}[]
  }
  idx: number
  isLast: boolean
}> = ({part: {title, body, image, lessons}, idx, isLast = false}) => {
  const index = idx + 1
  const gap = isLast ? 'md:pb-24 pb-10' : 'pb-10'

  const Thumbnail = () => {
    return image ? (
      <div className="overflow-hidden flex">
        <Image
          className="block"
          src={image}
          alt={title}
          width={202}
          height={171}
        />
      </div>
    ) : null
  }

  return (
    <div className="flex md:flex-row flex-col md:space-x-6 mt-4">
      <div
        className={`space-y-2 flex flex-col md:items-end items-center py-1 ${gap}`}
      >
        {/* <div className="uppercase font-semibold text-sm text-blue-500">Part {index}</div> */}
        {lessons ? (
          <Link href={get(first(lessons), 'path', '#')}>
            <a
              onClick={() => {
                track(`clicked first lesson thumbnail`, {
                  lesson: get(first(lessons), 'slug'),
                  project:
                    'create-an-ecommerce-store-with-next-js-and-stripe-checkout',
                })
              }}
            >
              <Thumbnail />
            </a>
          </Link>
        ) : (
          <Thumbnail />
        )}
      </div>
      <div className="md:flex hidden flex-col items-center relative">
        <div className="flex items-center justify-center text-center text-xs text-gray-400 font-semibold w-6 h-6 rounded-full border-2 border-gray-200 flex-shrink-0">
          <small>{index}</small>
        </div>
        <div className="border-r-2 border-gray-200 h-full" />
        {/* {isLast && (
          <div className="flex items-center justify-center text-center text-xs bg-blue-100 text-blue-500 font-semibold w-10 h-10 transform translate-y-10 absolute bottom-0 rounded-full border-none border-gray-200 flex-shrink-0">
            <FlagIcon />
          </div>
        )} */}
      </div>
      <div className={`md:w-full ${gap}`}>
        <h3 className="text-lg font-bold relative transform -translate-y-1 pb-1">
          {title}
        </h3>
        {body && <Markdown className="prose" source={body} />}
        {lessons && (
          <ul>
            {lessons.map((l) => (
              <li>
                {l.path ? (
                  <Link href={l.path}>
                    <a
                      onClick={() => {
                        track(`clicked lesson in list`, {
                          lesson: l.slug,
                          project:
                            'create-an-ecommerce-store-with-next-js-and-stripe-checkout',
                        })
                      }}
                      className="py-1 flex space-x-2 items-center text-gray-700 hover:text-blue-600 group"
                    >
                      {/* prettier-ignore */}
                      <div className="flex-shrink-0"><svg className="text-gray-400 group-hover:text-blue-600" width={18} height={18} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664l-3-2z" fill="currentColor"/></g></svg></div>
                      <div className="font-semibold">{l.title}</div>
                    </a>
                  </Link>
                ) : (
                  <div className="font-semibold py-1">{l.title}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
export default Course
