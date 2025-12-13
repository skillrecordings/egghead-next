import * as React from 'react'

interface BodyCopyMemberProps {
  /** Amount the member has already paid (used to show credit) */
  amountPaid?: number
}

/**
 * Concise body copy for existing egghead members
 * They already know egghead is great - just show them the upgrade value
 */
const BodyCopyMember: React.FC<BodyCopyMemberProps> = ({amountPaid}) => {
  return (
    <section className="container max-w-2xl px-6 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
            You're already an egghead member
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upgrade to lifetime and never think about renewals again
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            You know the value. You've used the lessons. Now lock in permanent
            access—every course, every update, forever.
          </p>

          {amountPaid && amountPaid > 0 && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Your payments are already credited
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${amountPaid} off your upgrade
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3 text-left">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-green-500">✓</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>No more renewals</strong>—one payment, done forever
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-green-500">✓</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>All future content included</strong>—new courses land in
                your library automatically
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-green-500">✓</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Bonus workshops</strong>—Claude Code + Cursor recordings
                ($750 value)
              </span>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Same 30-day money-back guarantee. No risk.
          </p>
        </div>
      </div>
    </section>
  )
}

export default BodyCopyMember
