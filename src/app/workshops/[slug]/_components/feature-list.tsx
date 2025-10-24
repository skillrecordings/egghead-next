type FeatureListProps = {
  features: string[]
  variant?: 'check' | 'bullet' | 'number'
}

/**
 * Feature List Component for MDX
 *
 * Usage in MDX:
 * <FeatureList
 *   features={["Feature 1", "Feature 2", "Feature 3"]}
 *   variant="check"
 * />
 */
export default function FeatureList({
  features,
  variant = 'check',
}: FeatureListProps) {
  const getIcon = () => {
    switch (variant) {
      case 'check':
        return (
          <svg
            className="w-6 h-6 text-green-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )
      case 'bullet':
        return (
          <svg
            className="w-6 h-6 text-blue-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="4" />
          </svg>
        )
      default:
        return null
    }
  }

  if (variant === 'number') {
    return (
      <ol className="my-8 space-y-4 max-w-2xl mx-auto">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
          >
            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-semibold">
              {index + 1}
            </span>
            <span className="pt-0.5">{feature}</span>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ul className="my-8 space-y-4 max-w-2xl mx-auto">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          {getIcon()}
          <span className="text-gray-700 dark:text-gray-300 pt-0.5">
            {feature}
          </span>
        </li>
      ))}
    </ul>
  )
}
