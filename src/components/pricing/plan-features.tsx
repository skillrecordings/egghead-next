import * as React from 'react'
import {LifetimePriceContext} from './lifetime-price-provider'
import slugify from 'slugify'

const Feature = ({
  feature,
  circleColor = '#D3DDF8',
  checkColor = '#3B79F0',
}: {
  feature: string
  circleColor?: string
  checkColor?: string
}) => (
  <li className="flex py-2 font-medium" key={slugify(feature)}>
    <CheckIcon circleColor={circleColor} checkColor={checkColor} />
    <span className="ml-2 leading-tight">{feature}</span>
  </li>
)

const CheckIcon = ({
  circleColor,
  checkColor,
}: {
  circleColor: string
  checkColor: string
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="size-6"
  >
    {/* Circle */}
    <circle cx="12" cy="12" r="9.75" fill={circleColor} />
    {/* Check */}
    <path
      fill={checkColor}
      fillRule="evenodd"
      d="M15.61 10.186a.75.75 0 0 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
)

const PlanFeatures: React.FC<
  React.PropsWithChildren<{
    planFeatures?: string[]
    className?: string
    hexColor?: string
    highlightHexColor?: string
    numberOfHighlightedFeatures?: number
  }>
> = ({
  className = '',
  planFeatures,
  hexColor = '#D3DDF8',
  highlightHexColor = '#FDE046',
  numberOfHighlightedFeatures = 0,
}) => {
  let features = planFeatures
  let lifetimePriceContext = React.useContext(LifetimePriceContext)

  if (!features && lifetimePriceContext?.planFeatures) {
    features = lifetimePriceContext.planFeatures
  }

  let highlightedFeatures = features?.slice(0, numberOfHighlightedFeatures)
  let remainingFeatures = features?.slice(numberOfHighlightedFeatures)

  return (
    <ul className={className}>
      {highlightedFeatures?.map((feature: string) => {
        return (
          <Feature
            feature={feature}
            circleColor={highlightHexColor}
            checkColor="#000000"
          />
        )
      })}
      {remainingFeatures?.map((feature: string) => {
        return <Feature feature={feature} circleColor={hexColor} />
      })}
    </ul>
  )
}

export default PlanFeatures
