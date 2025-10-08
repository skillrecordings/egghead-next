import {redirect} from 'next/navigation'
import {getPrimaryWorkshop} from '@/lib/events/get-event'

/**
 * Featured Workshop Redirect
 *
 * Redirects to the currently featured workshop, or shows a "coming soon" page
 * if no workshops are available.
 */
export default async function WorkshopIndexPage() {
  // Get the featured workshop (any workshop type)
  const primaryWorkshop = await getPrimaryWorkshop()

  if (!primaryWorkshop) {
    // No featured workshop, show coming soon page
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            No Workshops Available
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Check back soon for upcoming workshops!
          </p>
        </div>
      </div>
    )
  }

  // Redirect to the featured workshop
  redirect(`/workshops/${primaryWorkshop.fields.slug}`)
}

// Opt out of caching to always show latest featured workshop
export const dynamic = 'force-dynamic'
export const revalidate = 0
