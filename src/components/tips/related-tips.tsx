'use client'
import {Tip} from '@/lib/tips'
import {TipTeaser} from './tip-teaser'
import Link from 'next/link'
import analytics from '@/utils/analytics'

const RelatedTips: React.FC<{tips: Tip[]; currentTip: Tip}> = ({
  currentTip,
  tips,
}) => {
  return (
    <section className="mx-auto h-full w-full md:pl-3">
      <h2 className="font-heading pt-2 text-2xl font-black">
        <Link
          href="/tips"
          onClick={() => {
            analytics.events.activityInternalLinkClick(
              'tip',
              currentTip.slug,
              'all tips',
            )
          }}
        >
          More Tips
        </Link>
      </h2>
      <div className="flex flex-col pt-4">
        {tips
          .filter((tip) => tip.slug !== currentTip.slug)
          .map((tip) => {
            return (
              <TipTeaser
                key={tip.slug}
                tip={tip}
                onClick={() => {
                  analytics.events.activityInternalLinkClick(
                    'tip',
                    currentTip.slug,
                    tip?.tags ? tip?.tags[0]?.name : tip.slug,
                  )
                }}
              />
            )
          })}
      </div>
    </section>
  )
}

export default RelatedTips
