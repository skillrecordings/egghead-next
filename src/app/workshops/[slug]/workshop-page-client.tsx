'use client'

import {useRef, useMemo} from 'react'
import type {Event} from '@/schemas/event'
import type {EventCoupon} from '@/lib/events/get-event-coupons'
import {MDXRemote, type MDXRemoteSerializeResult} from 'next-mdx-remote'

// Import existing components
import Hero from '@/app/workshops/[slug]/_components/Hero'
import type {SignUpFormRef} from '@/app/workshops/[slug]/_components/Hero'
import ActiveSale from '@/components/workshop/claude-code/active-sale'
import {workshopMDXComponents} from '@/app/workshops/[slug]/_components/mdx-components'

type WorkshopPageClientProps = {
  event: Event
  coupons: EventCoupon[]
  serializedBody: MDXRemoteSerializeResult | null
}

/**
 * Workshop Page Client Component
 *
 * This is a client component that handles all the interactive features
 * of the workshop page (refs, state, etc.)
 */
export default function WorkshopPageClient({
  event,
  coupons,
  serializedBody,
}: WorkshopPageClientProps) {
  const formRef = useRef<SignUpFormRef>(null)
  const {fields} = event

  const saleIsActive = fields.isSaleLive ?? fields.state === 'published'

  // Define features (these come from event.fields or use defaults)
  const LIVE_WORKSHOP_FEATURES = fields.features || [
    'Live Q&A with John Lindquist',
    'Learn to prompt for developers',
    'Control context engineering for reliable AI results',
  ]

  const TEAM_WORKSHOP_FEATURES = fields.teamFeatures || [
    'Flexible scheduling',
    'Live Q&A with John Lindquist',
    'Scope and plan work',
    'Control context engineering for reliable AI results',
    'Script Claude programmatically with TypeScript SDK',
    'Automate tasks using custom Claude Hooks',
    'Integrate APIs securely via Model Context Protocols',
  ]

  // Create MDX components with context injected - memoized to prevent recreation
  const mdxComponentsWithContext = useMemo(
    () => ({
      ...workshopMDXComponents,
      // Pass context props to Hero component
      Hero: (props: any) => (
        <Hero
          {...props}
          formRef={formRef}
          saleisActive={saleIsActive}
          event={event}
        />
      ),
    }),
    [formRef, saleIsActive, event],
  )

  return (
    <main className="min-h-screen relative bg-white dark:bg-gray-900">
      <div className="relative">
        <div className="relative">
          {/* Hero Section */}
          {/* <Hero
            formRef={formRef}
            saleisActive={saleIsActive}
            event={event}
            workshop={fields.slug?.includes('cursor') ? 'cursor' : 'claude'}
            title={fields.heroHeadline}
            description={fields.heroSubheadline}
            heroImageUrl={fields.heroImage}
            instructorName={fields.instructorName}
            instructorImage={fields.instructorImage}
            instructorBio={fields.instructorBio}
          /> */}

          {/* Main Content */}
          <section className="z-10 relative pb-8">
            {/* Render body content with MDX components */}
            {serializedBody && (
              <div className="prose-base w-full sm:prose-lg md:prose-xl marker:text-blue-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:mt-10 sm:prose-h2:mt-20 prose-h2:mb-10 prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:font-bold prose-h2:text-center prose-h3:text-lg lg:prose-h3:text-xl prose-h3:font-semibold prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-blue-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline">
                <MDXRemote
                  {...serializedBody}
                  components={mdxComponentsWithContext}
                  scope={serializedBody.scope}
                />
              </div>
            )}
          </section>

          {/* Active Sale Section */}
          {saleIsActive && (
            <ActiveSale
              hasYearlyProDiscount={false} // TODO: Get from user context
              isMonthlyOrQuarterly={false}
              workshopFeatures={LIVE_WORKSHOP_FEATURES}
              teamWorkshopFeatures={TEAM_WORKSHOP_FEATURES}
              event={event}
              coupons={coupons}
              isLiveWorkshopLoading={false}
            />
          )}
        </div>
      </div>
    </main>
  )
}
