import * as React from 'react'
import {useViewer} from 'context/viewer-context'
import CreateAccount from '../create-account'
import Join from '../join'
import PricingWidget from 'components/pricing/pricing-widget'

const FreeAccount = () => {
  return (
    <div>
      <h3 className="text-xl font-medium text-center">Create free account</h3>
      <p className="pb-8 text-center opacity-80">
        Start learning from hundreds of free lessons
      </p>
      <CreateAccount
        actionLabel="Create free account"
        location="homepage footer"
      />
    </div>
  )
}

const Footer = () => {
  const {viewer} = useViewer()
  return (
    <section
      className={`flex flex-col items-center w-full max-w-screen-lg py-12 mx-auto md:flex-row sm:py-24 ${
        viewer ? 'justify-center' : ''
      }`}
    >
      {viewer ? (
        <PricingWidget />
      ) : (
        <>
          <FreeAccount />
          <hr className="md:px-16 md:my-0 my-12 w-full max-w-[60px] md:rotate-90 dark:border-gray-800 border-gray-100" />
          <Join />
        </>
      )}
    </section>
  )
}

export default Footer
