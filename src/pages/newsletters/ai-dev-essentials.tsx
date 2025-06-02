import * as React from 'react'
import {GetStaticProps} from 'next'
import {NextSeo} from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import {getAIDevEssentialsPosts} from '@/lib/ai-dev-essentials'
import {Post} from '@/pages/[post]'
import {truncate} from 'lodash'
import removeMarkdown from 'remove-markdown'

interface AIDevEssentialsPageProps {
  posts: Post[]
}

export default function AIDevEssentialsPage({posts}: AIDevEssentialsPageProps) {
  React.useEffect(() => {
    console.log(
      `INFO: AI Dev Essentials page rendered with ${posts.length} posts loaded`,
    )
  }, [posts.length])

  return (
    <>
      <NextSeo
        title="AI Dev Essentials Newsletter | egghead.io"
        description="Stay up-to-date with the latest AI development tools, techniques, and best practices. Join thousands of developers learning AI essentials."
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/newsletters/ai-dev-essentials`}
        openGraph={{
          title: 'AI Dev Essentials Newsletter | egghead.io',
          description:
            'Stay up-to-date with the latest AI development tools, techniques, and best practices. Join thousands of developers learning AI essentials.',
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/newsletters/ai-dev-essentials`,
          site_name: 'egghead',
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/images/ai-dev-essentials-og.png`,
              width: 1200,
              height: 630,
              alt: 'AI Dev Essentials Newsletter',
            },
          ],
        }}
        twitter={{
          handle: '@eggheadio',
          site: '@eggheadio',
          cardType: 'summary_large_image',
        }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                AI Dev Essentials
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                Master the latest AI development tools, techniques, and best
                practices. Join thousands of developers staying ahead of the AI
                revolution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <NewsletterSignupForm />
              </div>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest AI Dev Essentials
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our comprehensive collection of AI development resources,
              tutorials, and insights.
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                No AI Dev Essentials posts found. Check back soon for new
                content!
              </div>
            </div>
          )}
        </section>

        {/* Newsletter CTA Section */}
        <section className="bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Don't Miss Out
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Get the latest AI development insights delivered directly to
                your inbox. Join our community of forward-thinking developers.
              </p>
              <NewsletterSignupForm />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function PostCard({post}: {post: Post}) {
  const {fields, createdAt, name, image} = post
  const {title, summary, slug, description} = fields

  const postDescription = summary || description || ''
  const truncatedDescription = truncate(removeMarkdown(postDescription), {
    length: 150,
  })

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center mb-4">
          {image && (
            <Image
              src={image}
              alt={name || 'Author'}
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {name || 'egghead'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {formattedDate}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
          <Link
            href={`/${slug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {title}
          </Link>
        </h3>

        {truncatedDescription && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {truncatedDescription}
          </p>
        )}

        <Link
          href={`/${slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
        >
          Read more
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  )
}

function NewsletterSignupForm() {
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // Placeholder for newsletter signup - will be implemented in Commit 3
      console.log('Newsletter signup attempt for email:', email)
      setMessage(
        'Thank you for subscribing! Check your email for confirmation.',
      )
      setEmail('')
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-sm ${
            message.includes('Thank you')
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await getAIDevEssentialsPosts()

    return {
      props: {
        posts,
      },
      revalidate: 60, // Revalidate every minute
    }
  } catch (error) {
    console.error('Error fetching AI Dev Essentials posts:', error)

    return {
      props: {
        posts: [],
      },
      revalidate: 60,
    }
  }
}
