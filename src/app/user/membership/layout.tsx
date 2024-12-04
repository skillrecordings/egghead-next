import Invoices from '@/components/invoices'

export default async function MembershipPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      <h2 className="pb-3 md:pb-4 text-lg font-medium md:font-normal md:text-xl leading-none">
        Membership
      </h2>
      <div className="min-h-[200px] flex justify-center items-center">
        {children}
      </div>
      <Invoices headingAs="h3" />
    </div>
  )
}
