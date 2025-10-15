import {notFound} from 'next/navigation'
import {getEventBySlug, getAllWorkshops} from '@/lib/events/get-event'
import {getEventCoupons} from '@/lib/events/get-event-coupons'
import {Metadata} from 'next'
import serializeMDX from '@/markdown/serialize-mdx'

// Import workshop page wrapper (client component)
import WorkshopPageClient from './workshop-page-client'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Dynamic Workshop Page (Server Component)
 *
 * This page loads workshop content from the Course Builder database and renders
 * it using a client component wrapper for interactive features.
 */
export default async function WorkshopPage({params}: Props) {
  const {slug} = await params

  // Fetch workshop event from Course Builder
  const event = await getEventBySlug(slug)

  if (!event || event.type !== 'event') {
    notFound()
  }

  // Fetch coupons for this event
  const coupons = await getEventCoupons(event.id)

  // Serialize MDX body content if available
  const serializedBody = event.fields.body
    ? await serializeMDX(event.fields.body, {
        scope: {
          event,
          coupons,
        },
        syntaxHighlighterOptions: {
          theme: 'github-dark',
          lineNumbers: false,
          showCopyButton: false,
        },
      })
    : null

  // Pass data to client component for rendering
  return (
    <WorkshopPageClient
      event={event}
      coupons={coupons}
      serializedBody={serializedBody}
    />
  )
}

/**
 * Generate static params for all published workshops
 * This enables ISR (Incremental Static Regeneration)
 */
export async function generateStaticParams() {
  const workshops = await getAllWorkshops()

  return workshops.map((workshop) => ({
    slug: workshop.fields.slug,
  }))
}

/**
 * Revalidate every hour
 * This ensures workshop data stays fresh without rebuilding on every request
 */
export const revalidate = 3600

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    return {
      title: 'Workshop Not Found',
    }
  }

  const seo = event.fields.seo

  return {
    title: seo?.title || event.fields.title,
    description: seo?.description || event.fields.description,
    openGraph: {
      images: seo?.ogImage
        ? [
            {
              url: seo.ogImage,
              width: seo.ogImageWidth || 1200,
              height: seo.ogImageHeight || 630,
            },
          ]
        : [],
    },
  }
}
