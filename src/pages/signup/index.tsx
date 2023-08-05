import * as React from 'react'
import Header from 'components/pages/landing/header'
import Article from 'components/pages/landing/article/index.mdx'
import MembershipBenefits from 'components/pages/landing/membership-benefits'
import Footer from 'components/pages/landing/footer'
import Browse from '../../components/pages/landing/browse'
import SearchBar from '../../components/app/header/search-bar'

const SignupPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Article />
        <Browse />
      </main>
    </>
  )
}

export default SignupPage
