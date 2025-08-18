import * as React from 'react'
import Link from 'next/link'
import {trpc} from '@/app/_trpc/client'
import analytics from '@/utils/analytics'
import Image from 'next/legacy/image'

const WorkshopCTA: React.FC = () => {
  const {data: liveWorkshop, isLoading: isLiveWorkshopLoading} =
    trpc.featureFlag.getLiveWorkshop.useQuery({
      flag: 'featureFlagClaudeCodeWorkshopSale',
    })

  const isSaleLive = liveWorkshop?.isSaleLive ?? false

  if (isLiveWorkshopLoading || !isSaleLive || !liveWorkshop) {
    return null
  }

  // Use the date, startTime, endTime, and timeZone from the workshop data
  const workshopDate = liveWorkshop.date || ''
  const startTime = liveWorkshop.startTime || ''
  const endTime = liveWorkshop.endTime || ''
  const timeZone = liveWorkshop.timeZone || ''

  return (
    <div className="px-3 pb-8 max-w-screen-xl mx-auto">
      <Link
        href="/workshop/claude-code"
        className="group block rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-200"
        onClick={() => {
          analytics.events.activityInternalLinkClick(
            'workshop cta',
            'home page',
            'Claude Code Workshop',
            '/workshop/claude-code',
          )
        }}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3 lg:w-1/4 bg-[#0b0b0b] flex items-center justify-center p-8">
            <div className="relative w-full max-w-[200px] aspect-square">
              <Image
                src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1752698761/claude-code-workshop-logo-square_hopfzn.png"
                alt="Claude Code Workshop"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </div>
          <div className="flex-1 p-6 sm:p-8">
            {/* Primary Workshop Badge - Single focal point */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 tracking-wide uppercase">
                Live Workshop
              </span>
            </div>

            {/* Main Title - Dominant hierarchy */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              Transform into a Claude Code Power User
            </h3>

            {/* Workshop Details - Reduced prominence */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
              {workshopDate && (
                <span className="font-medium">{workshopDate}</span>
              )}
              {startTime && (
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {startTime} - {endTime} {timeZone && `(${timeZone})`}
                </span>
              )}
            </div>

            {/* Description - Clear hierarchy */}
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Join a hands-on session to unlock advanced Claude Code workflows,
              automation, and integrations that will transform your development
              process.
            </p>

            {/* Feature Tags - Consistent styling */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 font-medium">
                Live Q&A
              </span>
              <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 font-medium">
                TypeScript SDK
              </span>
              <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 font-medium">
                Custom Hooks
              </span>
              <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 font-medium">
                MCP Integration
              </span>
            </div>

            {/* Call to Action - Clear visual weight */}
            <div className="flex items-center text-gray-900 dark:text-gray-100 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Learn More</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default WorkshopCTA
