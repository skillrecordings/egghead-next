import {LIVE_WORKSHOP_SALE_FLAGS} from '@/lib/live-workshop-flags'

describe('LIVE_WORKSHOP_SALE_FLAGS', () => {
  it('includes every workshop sale flag eligible for purchase emails', () => {
    expect(LIVE_WORKSHOP_SALE_FLAGS).toEqual([
      'featureFlagCursorWorkshopSale',
      'featureFlagClaudeCodeWorkshopSale',
      'featureFlagCodexWorkshopSale',
      'featureFlagSoftwareFactoryWorkshopSale',
    ])
  })
})
