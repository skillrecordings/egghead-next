import cn from 'classnames'

export default function CompactFeedSkeleton() {
  return (
    <div className="px-5">
      <div className="rounded-lg border dark:border-gray-800 border-gray-200 overflow-hidden dark:bg-gray-800/50 bg-white">
        {Array.from({length: 10}).map((_, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-4 px-4 py-3 animate-pulse',
              index !== 9 && 'border-b dark:border-gray-700 border-gray-200',
            )}
          >
            {/* Icon/Thumbnail skeleton */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700" />

            {/* Content skeleton */}
            <div className="flex-grow min-w-0 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>

            {/* Instructor skeleton */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 hidden sm:block" />
            </div>

            {/* Type badge skeleton */}
            <div className="flex-shrink-0">
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
