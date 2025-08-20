import React from 'react'
import {LiveWorkshop} from '@/types'
import ActiveSale from './active-sale'
import PPPPricingDemo from './ppp-pricing-demo'
import MockedActiveSale from './active-sale-with-ppp-mock'

export default {
  title: 'Workshop/Claude Code/Active Sale (TS)',
  component: ActiveSale,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'ActiveSale component showing all pricing permutations for the Claude Code workshop',
      },
    },
  },
  decorators: [
    (Story: any) => (
      <div className="bg-gray-50 min-h-screen">
        <Story />
      </div>
    ),
  ],
}

// Mock workshop data
const mockWorkshopBase: LiveWorkshop = {
  date: '2024-01-15',
  startTime: '10:00 AM',
  timeZone: 'EST',
  utcOffset: '-05:00',
  endTime: '2:00 PM',
  isSaleLive: true,
  isEuFriendly: true,
  productId: 'workshop_claude_code',
  workshopPrice: '400',
  stripePaymentLink: 'https://buy.stripe.com/test',
  stripeEarlyBirdMemberCouponCode: 'EARLY_MEMBER_150',
  stripeMemberCouponCode: 'MEMBER_100',
  stripeEarlyBirdCouponCode: 'EARLY_75',
  stripeEarlyBirdMemberDiscount: '150',
  stripeMemberDiscount: '100',
  stripeEarlyBirdNonMemberDiscount: '75',
  isEarlyBird: true,
}

const mockWorkshopFeatures = [
  '4-hour live workshop with Q&A',
  'Complete Claude Code mastery guide',
  'Real-world project templates',
  'Lifetime access to recordings',
  'Private community access',
]

const mockTeamWorkshopFeatures = [
  'Custom team workshop session',
  'Team-specific use cases',
  'Advanced workflow strategies',
  'Post-workshop support',
  'Team collaboration guidelines',
]

const defaultArgs = {
  workshopFeatures: mockWorkshopFeatures,
  teamWorkshopFeatures: mockTeamWorkshopFeatures,
  workshop: mockWorkshopBase,
  isLiveWorkshopLoading: false,
}

// Yearly Pro Member Stories
export const YearlyProMemberEarlyBird = {
  args: {
    ...defaultArgs,
    hasYearlyProDiscount: true,
    isMonthlyOrQuarterly: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'User has yearly pro subscription and early bird is active. Shows member pricing with early bird discount (cheapest option).',
      },
    },
  },
}

export const YearlyProMemberRegular = {
  args: {
    ...defaultArgs,
    hasYearlyProDiscount: true,
    isMonthlyOrQuarterly: false,
    workshop: {
      ...mockWorkshopBase,
      isEarlyBird: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'User has yearly pro subscription but early bird period is over. Shows member discount only.',
      },
    },
  },
}

// Monthly/Quarterly Member Stories
export const MonthlyQuarterlyMemberEarlyBird = {
  args: {
    ...defaultArgs,
    hasYearlyProDiscount: false,
    isMonthlyOrQuarterly: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'User has monthly/quarterly subscription with early bird active. Shows early bird pricing with "Upgrade to yearly" CTA.',
      },
    },
  },
}

export const MonthlyQuarterlyMemberRegular = {
  args: {
    ...defaultArgs,
    hasYearlyProDiscount: false,
    isMonthlyOrQuarterly: true,
    workshop: {
      ...mockWorkshopBase,
      isEarlyBird: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'User has monthly/quarterly subscription, no early bird. Shows standard pricing with "Upgrade to yearly" CTA.',
      },
    },
  },
}

// Non-Member Stories
export const NonMemberEarlyBird = {
  args: {
    ...defaultArgs,
    hasYearlyProDiscount: false,
    isMonthlyOrQuarterly: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Non-member with early bird active. Shows early bird pricing with "Become a Pro member" CTA.',
      },
    },
  },
}

export const NonMemberStandard = {
  args: {
    ...defaultArgs,
    hasYearlyProDiscount: false,
    isMonthlyOrQuarterly: false,
    workshop: {
      ...mockWorkshopBase,
      isEarlyBird: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Non-member with standard pricing. Shows full price with "Become a Pro member" CTA.',
      },
    },
  },
}

// Loading State
export const LoadingState = {
  args: {
    ...defaultArgs,
    hasYearlyProDiscount: true,
    isLiveWorkshopLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component in loading state while fetching workshop data.',
      },
    },
  },
}

// PPP Scenarios with proper mocking
export const PPPIndiaAvailable = {
  render: () => {
    const pppCoupon = {
      coupon_discount: 0.75,
      coupon_code: 'VACC4I67',
      coupon_expires_at: 1755747908,
      default: false,
      price_message: 'Restricted Regional Pricing (IN)',
      coupon_region_restricted: true,
      coupon_region_restricted_to: 'IN',
      coupon_region_restricted_to_name: 'India',
    }

    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center">
            PPP Available - India (75% Discount)
          </h3>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Shows the pricing card with PPP discount available for India. Click
            "Apply PPP discount for India" below the card to see PPP pricing
            replace the tiered pricing.
          </p>
          <MockedActiveSale
            {...defaultArgs}
            hasYearlyProDiscount={false}
            isMonthlyOrQuarterly={false}
            pppCoupon={pppCoupon}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the pricing card when PPP discount is available for India (75% off). The PPP message appears below the card, and clicking it replaces the tiered pricing with single PPP price.',
      },
    },
  },
}

export const PPPBrazilAvailable = {
  render: () => {
    const pppCoupon = {
      coupon_discount: 0.4,
      coupon_code: 'BRAZIL40',
      coupon_expires_at: 1755747908,
      default: false,
      price_message: 'Restricted Regional Pricing (BR)',
      coupon_region_restricted: true,
      coupon_region_restricted_to: 'BR',
      coupon_region_restricted_to_name: 'Brazil',
    }

    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center">
            PPP Available - Brazil (40% Discount)
          </h3>
          <MockedActiveSale
            {...defaultArgs}
            hasYearlyProDiscount={false}
            isMonthlyOrQuarterly={false}
            pppCoupon={pppCoupon}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the pricing card when PPP discount is available for Brazil (40% off).',
      },
    },
  },
}

export const PPPKenyaAvailable = {
  render: () => {
    const pppCoupon = {
      coupon_discount: 0.5,
      coupon_code: 'KENYA50',
      coupon_expires_at: 1755747908,
      default: false,
      price_message: 'Restricted Regional Pricing (KE)',
      coupon_region_restricted: true,
      coupon_region_restricted_to: 'KE',
      coupon_region_restricted_to_name: 'Kenya',
    }

    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center">
            PPP Available - Kenya (50% Discount)
          </h3>
          <MockedActiveSale
            {...defaultArgs}
            hasYearlyProDiscount={false}
            isMonthlyOrQuarterly={false}
            pppCoupon={pppCoupon}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the pricing card when PPP discount is available for Kenya (50% off).',
      },
    },
  },
}

export const PPPNigeriaAvailable = {
  render: () => {
    const pppCoupon = {
      coupon_discount: 0.6,
      coupon_code: 'NIGERIA60',
      coupon_expires_at: 1755747908,
      default: false,
      price_message: 'Restricted Regional Pricing (NG)',
      coupon_region_restricted: true,
      coupon_region_restricted_to: 'NG',
      coupon_region_restricted_to_name: 'Nigeria',
    }

    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center">
            PPP Available - Nigeria (60% Discount)
          </h3>
          <MockedActiveSale
            {...defaultArgs}
            hasYearlyProDiscount={false}
            isMonthlyOrQuarterly={false}
            pppCoupon={pppCoupon}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the pricing card when PPP discount is available for Nigeria (60% off).',
      },
    },
  },
}

// Show what the component looks like when PPP is actually applied
export const PPPAppliedDemo = {
  render: () => {
    const basePrice = 400

    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold text-center">
            PPP Applied State - What Users See After Clicking "Apply PPP
            Discount"
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* India - 75% off */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                India (75% off)
              </h3>
              <PPPPricingDemo
                basePrice={basePrice}
                discountPercentage={0.75}
                countryName="India"
              />
            </div>

            {/* Brazil - 40% off */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Brazil (40% off)
              </h3>
              <PPPPricingDemo
                basePrice={basePrice}
                discountPercentage={0.4}
                countryName="Brazil"
              />
            </div>

            {/* Kenya - 50% off */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Kenya (50% off)
              </h3>
              <PPPPricingDemo
                basePrice={basePrice}
                discountPercentage={0.5}
                countryName="Kenya"
              />
            </div>

            {/* Nigeria - 60% off */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Nigeria (60% off)
              </h3>
              <PPPPricingDemo
                basePrice={basePrice}
                discountPercentage={0.6}
                countryName="Nigeria"
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ℹ️ When PPP is applied, this pricing display replaces both the
              Standard and Yearly Member pricing tiers in the ActiveSale
              component, showing a single, region-appropriate price.
            </p>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates what the pricing display looks like when PPP is applied. This single price display replaces the tiered pricing.',
      },
    },
  },
}

// Edge Cases
export const HighDiscountAmounts = {
  args: {
    ...defaultArgs,
    hasYearlyProDiscount: true,
    workshop: {
      ...mockWorkshopBase,
      workshopPrice: '500',
      stripeEarlyBirdMemberDiscount: '200',
      stripeMemberDiscount: '150',
      stripeEarlyBirdNonMemberDiscount: '100',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Testing with higher discount amounts to ensure UI handles larger numbers properly.',
      },
    },
  },
}

export const EuFriendlyTiming = {
  args: {
    ...defaultArgs,
    hasYearlyProDiscount: true,
    workshop: {
      ...mockWorkshopBase,
      startTime: '3:00 PM',
      endTime: '7:00 PM',
      timeZone: 'EST',
      isEuFriendly: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Workshop scheduled at EU-friendly time with tooltip indicator.',
      },
    },
  },
}

export const NonEuFriendlyTiming = {
  args: {
    ...defaultArgs,
    hasYearlyProDiscount: true,
    workshop: {
      ...mockWorkshopBase,
      startTime: '9:00 AM',
      endTime: '1:00 PM',
      timeZone: 'PST',
      isEuFriendly: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Workshop scheduled at non-EU-friendly time without tooltip.',
      },
    },
  },
}

// Team Scenarios
export const TeamModeToggle = {
  args: defaultArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Component with team toggle available. User can toggle between individual and team pricing by clicking the checkbox at the bottom.',
      },
    },
  },
}

// Comprehensive comparison story showing multiple scenarios side by side
export const AllScenariosComparison = {
  render: () => (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold text-center mb-8">
        All ActiveSale Component Scenarios
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Yearly Pro + Early Bird */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Yearly Pro + Early Bird
          </h3>
          <ActiveSale
            {...defaultArgs}
            hasYearlyProDiscount={true}
            isMonthlyOrQuarterly={false}
          />
        </div>

        {/* Monthly/Quarterly + Early Bird */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Monthly/Quarterly + Early Bird
          </h3>
          <ActiveSale
            {...defaultArgs}
            hasYearlyProDiscount={false}
            isMonthlyOrQuarterly={true}
          />
        </div>

        {/* Non-Member + Early Bird */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Non-Member + Early Bird
          </h3>
          <ActiveSale
            {...defaultArgs}
            hasYearlyProDiscount={false}
            isMonthlyOrQuarterly={false}
          />
        </div>

        {/* Non-Member Standard */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Non-Member Standard
          </h3>
          <ActiveSale
            {...defaultArgs}
            hasYearlyProDiscount={false}
            isMonthlyOrQuarterly={false}
            workshop={{
              ...mockWorkshopBase,
              isEarlyBird: false,
            }}
          />
        </div>
      </div>

      {/* PPP Pricing Scenarios */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          PPP (Purchasing Power Parity) Pricing Scenarios
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          These show what PPP pricing should look like when properly integrated
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 30% India PPP */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              India (30% Discount)
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
              <PPPPricingDemo
                basePrice={400}
                discountPercentage={0.3}
                countryName="India"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Base: $400 → PPP: $280
            </p>
          </div>

          {/* 40% Brazil PPP */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Brazil (40% Discount)
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
              <PPPPricingDemo
                basePrice={400}
                discountPercentage={0.4}
                countryName="Brazil"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Base: $400 → PPP: $240
            </p>
          </div>

          {/* 50% Kenya PPP */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Kenya (50% Discount)
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
              <PPPPricingDemo
                basePrice={400}
                discountPercentage={0.5}
                countryName="Kenya"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Base: $400 → PPP: $200
            </p>
          </div>

          {/* 20% Poland PPP */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Poland (20% Discount)
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
              <PPPPricingDemo
                basePrice={400}
                discountPercentage={0.2}
                countryName="Poland"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Base: $400 → PPP: $320
            </p>
          </div>

          {/* 35% Mexico PPP */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Mexico (35% Discount)
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
              <PPPPricingDemo
                basePrice={400}
                discountPercentage={0.35}
                countryName="Mexico"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Base: $400 → PPP: $260
            </p>
          </div>

          {/* 60% Nigeria PPP */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Nigeria (60% Discount)
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
              <PPPPricingDemo
                basePrice={400}
                discountPercentage={0.6}
                countryName="Nigeria"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Base: $400 → PPP: $160
            </p>
          </div>
        </div>
      </div>

      {/* Combined Scenarios */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          PPP + Member Status Combinations
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          How PPP interacts with different membership tiers
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PPP + Yearly Pro */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              PPP (India) + Yearly Pro Member
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded p-4">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Member Discount Applied First
                </p>
                <p className="text-lg">$400 - $100 (member) = $300</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
                <PPPPricingDemo
                  basePrice={300}
                  discountPercentage={0.3}
                  countryName="India"
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Final: $210 (Member + PPP)
              </p>
            </div>
          </div>

          {/* PPP + Early Bird */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              PPP (Brazil) + Early Bird
            </h3>
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/30 rounded p-4">
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">
                  Early Bird Discount Applied First
                </p>
                <p className="text-lg">$400 - $75 (early bird) = $325</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
                <PPPPricingDemo
                  basePrice={325}
                  discountPercentage={0.4}
                  countryName="Brazil"
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Final: $195 (Early Bird + PPP)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Pricing Cards with PPP Applied */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-4">
          Full Pricing Cards with PPP Applied
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-2">
          Complete ActiveSale components showing how PPP would look in the
          actual pricing card UI
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PPP Applied - Non-Member with Early Bird */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Non-Member + Early Bird + PPP (India)
            </h3>
            <div className="border-2 border-blue-500 rounded-lg p-2">
              <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900 rounded">
                <ActiveSale
                  {...defaultArgs}
                  hasYearlyProDiscount={false}
                  isMonthlyOrQuarterly={false}
                />
                {/* PPP Banner Overlay */}
                <div className="px-6 pb-6 -mt-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <PPPPricingDemo
                      basePrice={325}
                      discountPercentage={0.3}
                      countryName="India"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Early Bird $325 → PPP 30% off → Final: $227.50
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PPP Applied - Yearly Pro Member */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Yearly Pro Member + PPP (Brazil)
            </h3>
            <div className="border-2 border-green-500 rounded-lg p-2">
              <div className="bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-gray-900 rounded">
                <ActiveSale
                  {...defaultArgs}
                  hasYearlyProDiscount={true}
                  isMonthlyOrQuarterly={false}
                  workshop={{
                    ...mockWorkshopBase,
                    isEarlyBird: false,
                  }}
                />
                {/* PPP Banner Overlay */}
                <div className="px-6 pb-6 -mt-4">
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <PPPPricingDemo
                      basePrice={300}
                      discountPercentage={0.4}
                      countryName="Brazil"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Member $300 → PPP 40% off → Final: $180
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PPP Applied - Monthly Member */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Monthly Member + PPP (Kenya)
            </h3>
            <div className="border-2 border-purple-500 rounded-lg p-2">
              <div className="bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900 rounded">
                <ActiveSale
                  {...defaultArgs}
                  hasYearlyProDiscount={false}
                  isMonthlyOrQuarterly={true}
                  workshop={{
                    ...mockWorkshopBase,
                    isEarlyBird: false,
                  }}
                />
                {/* PPP Banner Overlay */}
                <div className="px-6 pb-6 -mt-4">
                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <PPPPricingDemo
                      basePrice={400}
                      discountPercentage={0.5}
                      countryName="Kenya"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Standard $400 → PPP 50% off → Final: $200
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PPP Applied - Best Case Scenario */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Best Case: Yearly Pro + Early Bird + PPP (Nigeria)
            </h3>
            <div className="border-2 border-orange-500 rounded-lg p-2">
              <div className="bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-900 rounded">
                <ActiveSale
                  {...defaultArgs}
                  hasYearlyProDiscount={true}
                  isMonthlyOrQuarterly={false}
                />
                {/* PPP Banner Overlay */}
                <div className="px-6 pb-6 -mt-4">
                  <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <PPPPricingDemo
                      basePrice={250}
                      discountPercentage={0.6}
                      countryName="Nigeria"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Member Early Bird $250 → PPP 60% off → Final: $100
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Side-by-side comparison of all major scenarios to easily spot differences in pricing, CTAs, and visual states.',
      },
    },
  },
}
