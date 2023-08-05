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
import VideoCard from 'components/pages/home/video-card'

type CourseProps = {
  course: any
  dependencies: any
}

const Course: FunctionComponent<React.PropsWithChildren<CourseProps>> = () => {
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
      bio: 'Colby is a UX designer and front-end engineer living on the Philly side of Pennsylvania. He got his start in web design customizing his AIM and MySpace pages, and quickly graduated to whole websites for teams and bands. He currently works as a developer advocate for Applitools.',
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
    articles: [
      {
        title: `Build a CMS for an E-commerce Store with Next.js and Sanity`,
        description: `Having the ability to build an online store opens up a ton of possibilities, whether you’re building that store for a new client to pay the bills or you’re trying to start your own business. In this article, you will learn how to build a CMS for an ecommerce store with Next.js and Sanity`,
        name: `manage product inventory`,
        image: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1613432463/next.egghead.io/resources/create-an-ecommerce-store-with-next-js-and-stripe-checkout/build-cms-e-commerce-article_2x.png`,
        path: `/blog/build-cms-for-ecommerce-store-with-nextjs-and-sanity`,
      },
      {
        title: `Product Images That Don't Byte with the Next.js Image Component`,
        name: `Build high-performance ecommerce sites`,
        description: `By using the Next.js Image Component, you can add images to your project just like you would the standard img tag and be confident that you’ll be serving optimized images to your website visitors.`,
        image: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1613454662/next.egghead.io/resources/create-an-ecommerce-store-with-next-js-and-stripe-checkout/product-images-ecommerce-article_2x.png`,
        path: `/blog/product-images-that-dont-byte-with-the-nextjs-image-component`,
      },
    ],
    video: {
      name: 'Explore the challenges of ecommerce',
      title: 'Getting Personal with Ecommerce, React, & the Static Web',
      description: `Ecommerce depends on highly dynamic solutions personalizing experiences for customers from the price of a product to the total cost of that customer’s shopping cart. How can we leverage React and tools like Next.js to bring that dynamic experience to the static web? 
        
In this talk, we’ll explore the challenges of ecommerce in a static world. We’ll talk about what tools are available to us and how we can take advantage of them to build dynamic web apps with a practical example of a Next.js app.`,
      byline: 'Colby Fayock',
      path: '/talks/react-getting-personal-with-ecommerce-react-the-static-web',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1613463219/next.egghead.io/resources/create-an-ecommerce-store-with-next-js-and-stripe-checkout/challenges-of-ecommerce-cover_2.png',
    },
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
            path: '/lessons/next-js-create-a-new-react-application-with-the-next-js-create-next-app-cli',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `next-js-add-and-style-a-grid-of-products-with-images-in-a-next-js-react-app`,
            title:
              'Add and Style a Grid of Products with Images in a Next.js React App',
            path: '/lessons/next-js-add-and-style-a-grid-of-products-with-images-in-a-next-js-react-app',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `next-js-add-and-configure-products-in-the-stripe-dashboard-for-an-online-store`,
            title:
              'Add and Configure Products in the Stripe Dashboard for an Online Store',
            path: '/lessons/next-js-add-and-configure-products-in-the-stripe-dashboard-for-an-online-store',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `javascript-dynamically-manage-a-grid-of-products-in-an-online-store-with-a-json-document`,
            title:
              'Dynamically Manage a Grid of Products in an Online Store with a JSON Document',
            path: '/lessons/javascript-dynamically-manage-a-grid-of-products-in-an-online-store-with-a-json-document',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/square_280/javascriptlang.png',
          },
          {
            slug: `next-js-host-deploy-a-next-js-react-app-on-vercel-imported-from-github`,
            title:
              'Host & Deploy a Next.js React App on Vercel imported from GitHub',
            path: '/lessons/next-js-host-deploy-a-next-js-react-app-on-vercel-imported-from-github',
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
            path: '/lessons/stripe-configure-a-stripe-checkout-domain-for-client-only-integration',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/294/square_280/Artboard.png',
          },
          {
            slug: `next-js-add-a-stripe-api-key-as-an-environment-variable-in-next-js-vercel`,
            title:
              'Add a Stripe API Key as an Environment Variable in Next.js & Vercel',
            path: '/lessons/next-js-add-a-stripe-api-key-as-an-environment-variable-in-next-js-vercel',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `stripe-integrate-stripe-checkout-to-purchase-products-in-next-js-with-stripe-stripe-stripe-js-cl`,
            title:
              'Integrate Stripe Checkout to Purchase Products in Next.js with Stripe @stripe/stripe-js Cl',
            path: '/lessons/stripe-integrate-stripe-checkout-to-purchase-products-in-next-js-with-stripe-stripe-stripe-js-cl',
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
            path: '/lessons/react-create-a-shopping-cart-with-the-usestate-react-hook-to-manage-product-quantity-and-total',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_280/react.png',
          },
          {
            slug: `react-create-a-custom-react-hook-to-manage-cart-state`,
            title: 'Create a Custom React Hook to Manage Cart State',
            path: '/lessons/react-create-a-custom-react-hook-to-manage-cart-state',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_280/react.png',
          },
          {
            slug: `react-use-the-react-context-api-to-globally-manage-cart-state-in-a-next-js-app`,
            title:
              'Use the React Context API to Globally Manage Cart State in a Next.js App',
            path: '/lessons/react-use-the-react-context-api-to-globally-manage-cart-state-in-a-next-js-app',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_280/react.png',
          },
          {
            slug: `react-store-and-load-cart-state-from-local-storage-to-persist-cart-data-when-reloading-the-page`,
            title:
              'Store and Load Cart State from Local Storage to Persist Cart Data When Reloading the Page',
            path: '/lessons/react-store-and-load-cart-state-from-local-storage-to-persist-cart-data-when-reloading-the-page',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_280/react.png',
          },
          {
            slug: `next-js-use-next-js-dynamic-routes-to-create-product-pages-for-an-online-store`,
            title:
              'Use Next.js Dynamic Routes to Create Product Pages for an Online Store',
            path: '/lessons/next-js-use-next-js-dynamic-routes-to-create-product-pages-for-an-online-store',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `next-js-create-a-shopping-cart-page-to-manage-products-to-purchase-in-a-next-js-app`,
            title:
              'Create a Shopping Cart Page to Manage Products to Purchase in a Next.js App',
            path: '/lessons/next-js-create-a-shopping-cart-page-to-manage-products-to-purchase-in-a-next-js-app',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/square_280/nextjs.png',
          },
          {
            slug: `react-add-a-quantity-input-to-the-cart-page-to-add-or-remove-items-from-a-shopping-cart-in-next`,
            title:
              'Add a Quantity Input to the Cart Page to Add or Remove Items from a Shopping Cart in Next',
            path: '/lessons/react-add-a-quantity-input-to-the-cart-page-to-add-or-remove-items-from-a-shopping-cart-in-next',
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
          <header className="relative pt-5">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-500" />
            <div className="container">
              <div className="flex flex-col items-center justify-center pt-4 pb-8 space-y-6 md:flex-row md:space-x-10 md:space-y-0 md:pb-16 md:pt-8">
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
                  <div className="text-xs font-medium tracking-wide text-center text-pink-600 uppercase md:text-left">
                    Portfolio Project
                  </div>
                  <h1 className="max-w-screen-sm pb-6 text-3xl font-bold leading-snug tracking-tight text-center md:text-3xl md:text-left">
                    {course.title}
                  </h1>
                  <Tags tags={course.tags} />
                </div>
              </div>
            </div>
          </header>
          <main>
            <div className="container">
              <Markdown
                className="max-w-screen-md mx-auto prose prose-lg md:prose-xl dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 dark:prose-lg-dark dark:md:prose-xl-dark"
                source={course.summary}
              />
            </div>
            <div className="pt-24 mt-20 bg-gray-50 dark:bg-gray-800">
              <div className="container">
                <div className="max-w-screen-lg mx-auto">
                  <div className="mb-4 text-sm font-medium tracking-wide text-center text-blue-600 uppercase md:text-left">
                    What You’ll Build for Your Portfolio
                  </div>
                  <h2 className="pb-12 text-3xl font-semibold text-center sm:text-2xl sm:text-left leading-tighter">
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
            </div>
            <div className="pt-10 pb-40 text-white bg-gray-900 md:pt-24">
              <div className="container">
                <div className="grid max-w-screen-lg grid-cols-1 gap-10 mx-auto text-center md:grid-cols-2 md:text-left">
                  <div>
                    {/* <div className="mb-2 text-sm font-medium tracking-wide text-center text-purple-300 uppercase md:text-left">
                    What You’ll Build for Your Portfolio
                  </div> */}
                    <p className="max-w-md mx-auto mt-4 text-xl md:mx-0">
                      By the end of this project, you’ll have your own dynamic
                      eCommerce store with a working checkout flow.
                    </p>
                    <ul className="mt-6 text-lg font-light leading-10 list-none list-inside text-blueGray-200">
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
                  <div className="row-start-1 md:row-start-auto">
                    <Image
                      className="rounded-md shadow-lg"
                      src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608034859/next.egghead.io/pages/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout/screenshot-of-space-jelly-shop-interface.png"
                      width={1128 / 2}
                      height={698 / 2}
                      alt="a screenshot of space jelly shop interface"
                    />
                  </div>
                </div>
                <div className="grid max-w-screen-lg grid-cols-2 mx-auto mt-16 font-light tracking-wide text-center text-purple-300 md:grid-cols-5 lg:grid-rows-2 md:gap-x-12 gap-x-3 md:gap-y-6 gap-y-5">
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
            </div>
          </main>
        </article>

        <Instructor instructor={course.instructor} />
        <Articles articles={course.articles}>
          <VideoCard resource={course.video} />
        </Articles>

        <Join />
      </div>
    </>
  )
}

// ——— COMPONENTS

const Join: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  const {viewer} = useViewer()
  return (
    <div className="py-24 text-center text-white bg-gray-100 dark:bg-gray-800">
      <div className="container flex flex-col items-center space-y-6">
        <div className="w-16">
          <Image src={Eggo} alt="" />
        </div>
        <h2 className="max-w-2xl text-xl font-semibold text-gray-900 lg:text-2xl leading-tighter dark:text-gray-100">
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
                className="px-6 py-4 font-semibold text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-lg hover:scale-105 hover:bg-blue-500 hover:shadow-xl"
              >
                Build this E-Commerce Store
              </a>
            </Link>
          </>
        ) : (
          <>
            <div className="text-gray-900 dark:text-gray-100">
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
                className="px-6 py-4 font-semibold text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-lg hover:scale-105 hover:bg-blue-500 hover:shadow-xl"
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

const Instructor: FunctionComponent<
  React.PropsWithChildren<{
    instructor: {
      name: string
      bio: string
      path: string
      image: string
      slug: string
    }
  }>
> = ({instructor: {name, bio, path, image, slug}}) => {
  return (
    <div className="py-20 text-white bg-gray-100 dark:bg-gray-800">
      <div className="container">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="p-1 mb-4 overflow-hidden bg-white rounded-full">
              <Image
                className="rounded-full"
                src={image}
                width={160}
                height={160}
                alt="Colby Fayock"
              />
            </div>
            <div className="text-xs text-gray-600 uppercase dark:text-gray-400">
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
                className="text-lg font-semibold text-gray-900 dark:text-gray-200"
              >
                {name}
              </a>
            </Link>
            <Markdown
              className="max-w-xl prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500"
              source={bio}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const Tags: FunctionComponent<
  React.PropsWithChildren<{
    tags: {title: string; image: React.ReactElement}[]
  }>
> = ({tags}) => {
  return (
    <div className="flex items-center justify-center space-x-6 md:justify-start">
      {tags.map((tag) => (
        <div key={tag.title} className="flex items-center space-x-1">
          {tag.image}
          <span>{tag.title}</span>
        </div>
      ))}
    </div>
  )
}

const Part: FunctionComponent<
  React.PropsWithChildren<{
    part: {
      title: string
      body?: string
      image: string
      lessons?: {title: string; path: string; slug: string}[]
    }
    idx: number
    isLast: boolean
  }>
> = ({part: {title, body, image, lessons}, idx, isLast = false}) => {
  const index = idx + 1
  const gap = isLast ? 'md:pb-24 pb-10' : 'pb-10'

  const Thumbnail = () => {
    return image ? (
      <div className="flex overflow-hidden">
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
    <div className="flex flex-col mt-4 md:flex-row md:space-x-6">
      <div
        className={`space-y-2 flex flex-col md:items-end items-center py-1 ${gap}`}
      >
        {/* <div className="text-sm font-semibold text-blue-500 uppercase">Part {index}</div> */}
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
      <div className="relative flex-col items-center hidden md:flex">
        <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-semibold text-center text-gray-400 border-2 border-gray-200 rounded-full dark:border-gray-400">
          <small>{index}</small>
        </div>
        <div className="h-full border-r-2 border-gray-200 dark:border-gray-400" />
        {/* {isLast && (
          <div className="absolute bottom-0 flex items-center justify-center flex-shrink-0 w-10 h-10 text-xs font-semibold text-center text-blue-500 transform translate-y-10 bg-blue-100 border-gray-200 border-none rounded-full">
            <FlagIcon />
          </div>
        )} */}
      </div>
      <div className={`md:w-full ${gap}`}>
        <h3 className="relative pb-1 text-lg font-bold -translate-y-1">
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
                      className="flex items-center py-1 space-x-2 text-gray-700 dark:text-gray-100 hover:text-blue-600 group"
                    >
                      {/* prettier-ignore */}
                      <div className="flex-shrink-0"><svg className="text-gray-400 dark:text-gray-400 group-hover:text-blue-600" width={18} height={18} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664l-3-2z" fill="currentColor"/></g></svg></div>
                      <div className="font-semibold">{l.title}</div>
                    </a>
                  </Link>
                ) : (
                  <div className="py-1 font-semibold">{l.title}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

const Articles: React.FC<React.PropsWithChildren<{articles: any}>> = ({
  articles,
  children,
}) => {
  return (
    <div className="pt-24 pb-40 text-white bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="max-w-screen-lg mx-auto">
          <div className="mb-4 text-sm font-medium tracking-wide text-center text-blue-600 uppercase md:text-left">
            Build Beyond this project
          </div>
          <h2 className="pb-4 text-3xl font-semibold text-center text-gray-900 sm:text-2xl md:text-left leading-tighter dark:text-gray-200">
            Additional Learning Resources
          </h2>

          <div className="relative">
            <div className="absolute inset-0">
              <div className="h-2/3"></div>
            </div>
            <div className="relative mx-auto max-w-7xl">
              <div className="grid gap-5 mx-auto mt-12 md:grid-cols-2 md:max-w-none">
                {articles.map((article: any) => {
                  return (
                    <div
                      className="flex flex-col mb-4 overflow-hidden rounded-lg shadow-lg"
                      key={article.path}
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="object-cover w-full h-72"
                          src={article.image}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1 p-6 dark:bg-gray-800">
                        <h2 className="text-xs font-semibold text-gray-700 uppercase dark:text-gray-200">
                          {article.name}
                        </h2>
                        <div className="flex-1">
                          <a href={article.path} className="block mt-2">
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                              {article.title}
                            </p>
                            <Markdown className="mt-4 prose-sm prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 dark:prose-sm-dark">
                              {article.description}
                            </Markdown>
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Course
