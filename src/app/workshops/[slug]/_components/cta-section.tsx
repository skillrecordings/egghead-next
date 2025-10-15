import {forwardRef} from 'react'

export interface SignUpFormRef {
  focus: () => void
}

interface CtaSectionProps {
  ActiveSaleUi: React.ReactNode
  SaleClosedUi: React.ReactNode
  saleisActive: boolean
}

const CtaSection = forwardRef<SignUpFormRef, CtaSectionProps>(
  ({ActiveSaleUi, SaleClosedUi, saleisActive}, ref) => {
    return (
      <div id="signup">
        {saleisActive === true ? ActiveSaleUi : SaleClosedUi}
      </div>
    )
  },
)

CtaSection.displayName = 'CtaSection'

export default CtaSection
