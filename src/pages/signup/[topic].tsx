import * as React from 'react'
import Header from 'components/pages/landing/header'
import Article from 'components/pages/landing/article/index.mdx'
import MembershipBenefits from 'components/pages/landing/membership-benefits'
import Footer from 'components/pages/landing/footer'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from '../../utils/tracing-js/dist/src'
import getTracer from '../../utils/honeycomb-tracer'

const tracer = getTracer('signup-topic-page')

const NewHome: React.FC<{topic?: string; customer?: any}> = ({
  topic,
  customer,
}) => {
  return (
    <>
      <Header topic={topic} customer={customer} />
      <main className="pt-16">
        <Article topic={topic} />
        <section>
          <div className="w-full pt-16 pb-5 bg-gradient-to-t dark:from-gray-1000 dark:via-gray-1000 dark:to-gray-900 from-gray-50 via-gray-50 to-white sm:pt-24 sm:pb-24">
            <h2 className="mx-auto text-xl font-semibold leading-tight text-center pb-14">
              What you’ll get as an egghead member
            </h2>
            <MembershipBenefits topic={topic} />
          </div>
        </section>
        <Footer topic={topic} />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  let customer

  try {
    if (req.cookies.customer) {
      customer = JSON.parse(req.cookies.customer)
    }
  } catch (e) {
    console.log(e)
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  return {
    props: {
      topic: params?.topic,
      customer,
    },
  }
}

export default NewHome
