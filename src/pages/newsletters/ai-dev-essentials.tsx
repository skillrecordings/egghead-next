import * as React from 'react'
import {GetStaticProps} from 'next'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {getAIDevEssentialsPosts} from '@/lib/ai-dev-essentials'
import {Post} from '@/pages/[post]'
import {truncate} from 'lodash'
import removeMarkdown from 'remove-markdown'
import NewsletterSignupForm from '@/components/forms/newsletter-signup'
import {PerformanceMonitor} from '@/components/monitoring/performance-monitor'
import {AIDevEssentialsErrorBoundary} from '@/components/monitoring/ai-dev-essentials-error-boundary'
import {
  trackPageView,
  trackPostClick,
} from '@/utils/analytics/ai-dev-essentials'
import {
  Lightbulb,
  Heart,
  Settings,
  FileText,
  BookOpen,
  Users,
  ChevronRight,
} from 'lucide-react'

interface AIDevEssentialsPageProps {
  posts: Post[]
}

export default function AIDevEssentialsPage({posts}: AIDevEssentialsPageProps) {
  const router = useRouter()

  React.useEffect(() => {
    console.log(
      `INFO: AI Dev Essentials page rendered with ${posts.length} posts loaded`,
    )

    // Track page view with UTM parameters
    const {utm_source, utm_medium, utm_campaign, source} = router.query
    trackPageView({
      source: source as string,
      utm_source: utm_source as string,
      utm_medium: utm_medium as string,
      utm_campaign: utm_campaign as string,
    })
  }, [posts.length, router.query])

  return (
    <AIDevEssentialsErrorBoundary>
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

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/90 mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Newsletter
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                AI Dev Essentials
                <br />
                <span className="text-blue-400">
                  Your Weekly Edge in AI Development
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-slate-300 leading-relaxed">
                Stay ahead in the non-stop world of AI with insights, updates,
                and practical lessons from John Lindquist.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <NewsletterSignupForm />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    100,000+
                  </div>
                  <div className="text-slate-400">Developers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    Weekly
                  </div>
                  <div className="text-slate-400">Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">100%</div>
                  <div className="text-slate-400">Free</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                The AI landscape is moving at breakneck speed
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto">
                Keeping up can feel like a full-time job. With AI Dev
                Essentials, you'll receive a curated weekly digest that cuts
                through the noise, delivering only the most relevant and
                actionable intelligence directly to your inbox.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Deep Dives & Real-World Experiences
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Learn from candid accounts of pushing the boundaries with the
                  latest AI models, understanding their quirks, costs, and true
                  capabilities.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Cutting-Edge Model Updates
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Get the breakdown on significant releases from Google,
                  Anthropic, and others, including their practical implications
                  for your projects.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Essential Developer Tool Insights
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Discover new AI-powered tools from Microsoft, Vercel, and
                  innovative startups to optimize your workflow.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  The Evolving Agent Landscape
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Navigate the complex world of AI coding agents with expert
                  analysis of their strengths, limitations, and security
                  considerations.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Practical Learning & Workshops
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Access new egghead.io lessons with hands-on guidance for
                  integrating AI into your development practices.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Community Buzz & Pro Tips
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Stay connected with quick links and valuable tips shared by
                  developers in the AI community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Stop sifting through endless feeds and start building smarter
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Join a community of developers who are not just watching the
                future of AI unfold, but actively building it.
              </p>
            </div>

            {posts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <PostCard key={post.id} post={post} position={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-slate-500 dark:text-slate-400 text-xl">
                  No AI Dev Essentials posts found. Check back soon for new
                  content!
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA Section */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Sign up for AI Dev Essentials today
              <br />
              <span className="text-blue-400">
                and empower your AI development journey
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers who are staying ahead in the rapidly
              evolving world of AI development.
            </p>
            <NewsletterSignupForm />
          </div>
        </section>
      </div>

      {/* Performance Monitor */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor pageName="ai-dev-essentials-newsletter" />
      )}
    </AIDevEssentialsErrorBoundary>
  )
}

function PostCard({post, position}: {post: Post; position?: number}) {
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

  const handlePostClick = () => {
    if (!post.id) return

    if (position !== undefined) {
      trackPostClick({
        post_id: post.id,
        post_title: title,
        position: position + 1, // 1-indexed for analytics
      })
    }
  }

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group">
      <div className="p-8">
        <div className="flex items-center mb-6">
          {image && (
            <Image
              src={image}
              alt={name || 'Author'}
              width={48}
              height={48}
              className="rounded-full mr-4"
            />
          )}
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {name || 'egghead'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formattedDate}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link
            href={`/${slug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={handlePostClick}
          >
            {title}
          </Link>
        </h3>

        {truncatedDescription && (
          <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed">
            {truncatedDescription}
          </p>
        )}

        <Link
          href={`/${slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors group"
          onClick={handlePostClick}
        >
          Read more
          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await getAIDevEssentialsPosts()

    return {
      props: {
        posts,
      },
      revalidate: 500, // Revalidate every minute
    }
  } catch (error) {
    console.error('Error fetching AI Dev Essentials posts:', error)

    return {
      props: {
        posts: [],
      },
      revalidate: 500,
    }
  }
}
