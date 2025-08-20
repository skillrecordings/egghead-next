import React from 'react'
import PPPPricingDemo from './ppp-pricing-demo'
import {LiveWorkshop} from '@/types'

export default {
  title: 'Workshop/Claude Code/PPP Pricing Demo',
  component: PPPPricingDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Demonstration of what PPP pricing should look like when applied to the ActiveSale component',
      },
    },
  },
}

// Demo data
const mockWorkshop: LiveWorkshop = {
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

export const PPPIndiaDiscount = {
  args: {
    basePrice: 400,
    discountPercentage: 0.5,
    countryName: 'India',
  },
  parameters: {
    docs: {
      description: {
        story: 'PPP pricing for India with 50% discount applied',
      },
    },
  },
}

export const PPPBrazilDiscount = {
  args: {
    basePrice: 400,
    discountPercentage: 0.6,
    countryName: 'Brazil',
  },
  parameters: {
    docs: {
      description: {
        story: 'PPP pricing for Brazil with 60% discount applied',
      },
    },
  },
}

export const PPPUkraineDiscount = {
  args: {
    basePrice: 400,
    discountPercentage: 0.75,
    countryName: 'Ukraine',
  },
  parameters: {
    docs: {
      description: {
        story: 'PPP pricing for Ukraine with 75% discount applied',
      },
    },
  },
}

// Comprehensive demo showing the flow
export const PPPFlowDemonstration = {
  render: () => (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold text-center mb-8">
        PPP Pricing Flow Demonstration
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Standard Pricing */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
            Step 1: Standard Pricing Display
          </h3>
          <div className="space-y-3">
            {/* Standard pricing tier */}
            <div className="p-4 rounded-lg border border-blue-500 bg-white shadow-lg">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-start flex gap-2">
                Standard Pricing
                <div className="text-xs font-medium text-blue-500 text-start">
                  ✓
                </div>
              </div>
              <div className="flex items-baseline justify-start gap-3 mt-2">
                <span className="text-2xl font-black tracking-tight">$325</span>
                <span className="text-base text-gray-400 line-through">
                  $400
                </span>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  🔥 Early Bird
                </span>
              </div>
            </div>

            {/* Member pricing tier */}
            <div className="p-4 rounded-lg border border-gray-300 bg-gray-50 opacity-50">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Yearly Member Pricing
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black tracking-tight text-gray-700">
                  $250
                </span>
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Was
                  </div>
                  <span className="text-base text-gray-400 line-through font-semibold">
                    $325
                  </span>
                </div>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-blue-500 py-1 rounded-full transition-all duration-200 mt-2"
              >
                Become a Pro member for this price →
              </a>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 User from qualifying region sees PPP message at bottom
            </p>
          </div>
        </div>

        {/* Step 2: PPP Applied */}
        <div className="border rounded-lg p-6 bg-green-50 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-center text-green-800">
            Step 2: PPP Discount Applied
          </h3>
          <div className="bg-white p-4 rounded-lg">
            <PPPPricingDemo
              basePrice={400}
              discountPercentage={0.5}
              countryName="India"
            />
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Tiered pricing is replaced with single PPP price
            </p>
          </div>
        </div>
      </div>

      {/* Current Issue */}
      <div className="bg-red-50 p-6 rounded-lg">
        <h4 className="font-semibold text-red-800 mb-2">
          🐛 Current Issue in ActiveSale Component:
        </h4>
        <div className="text-sm text-red-700 space-y-2">
          <p>
            <strong>Problem:</strong> PPP pricing is not displaying correctly in
            the current implementation
          </p>
          <p>
            <strong>Root Cause:</strong> The <code>useCommerceMachine</code>{' '}
            hook needs to provide <code>availableCoupons.ppp</code> data for PPP
            functionality to work
          </p>
          <p>
            <strong>Expected Behavior:</strong>
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>
              When user is from qualifying region → Show PPP coupon message at
              bottom
            </li>
            <li>
              When user clicks "Apply Discount" → Replace tiered pricing with
              PPP pricing (like Step 2 above)
            </li>
            <li>
              PPP pricing should calculate from base workshop price (
              {mockWorkshop.workshopPrice})
            </li>
          </ol>
        </div>
      </div>

      {/* Different PPP Examples */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-center">
          PPP Pricing Examples by Region
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-medium mb-2 text-center">India (50% off)</h5>
            <PPPPricingDemo
              basePrice={400}
              discountPercentage={0.5}
              countryName="India"
            />
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-medium mb-2 text-center">Brazil (60% off)</h5>
            <PPPPricingDemo
              basePrice={400}
              discountPercentage={0.6}
              countryName="Brazil"
            />
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-medium mb-2 text-center">Ukraine (75% off)</h5>
            <PPPPricingDemo
              basePrice={400}
              discountPercentage={0.75}
              countryName="Ukraine"
            />
          </div>
        </div>
      </div>

      {/* Technical Notes */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">
          🔧 Technical Implementation Notes:
        </h4>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>File:</strong>{' '}
            <code>src/components/workshop/claude-code/active-sale.tsx</code>
          </p>
          <p>
            <strong>Key Logic:</strong> Lines 281-300 show the PPP pricing when{' '}
            <code>couponToApply.type === 'ppp'</code>
          </p>
          <p>
            <strong>Hook Dependency:</strong> <code>useCommerceMachine()</code>{' '}
            must return <code>availableCoupons.ppp</code> data
          </p>
          <p>
            <strong>User Flow:</strong> User sees PPP message → clicks apply →{' '}
            <code>onApplyParityCoupon()</code> sets couponToApply type to 'ppp'
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Complete demonstration of the PPP pricing flow showing what should happen when PPP coupons are available and applied',
      },
    },
  },
}
