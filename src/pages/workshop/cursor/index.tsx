'use client'
import Layout from '@/components/app/layout'
import Hero from '@/components/workshop/cursor/Hero'
import Features from '@/components/workshop/cursor/Features'
import WorkshopStructure from '@/components/workshop/cursor/WorkshopStructure'
import Instructor from '@/components/workshop/cursor/Instructor'
import SignUpForm from '@/components/workshop/cursor/SignUpForm'
import type {SignUpFormRef} from '@/components/workshop/cursor/SignUpForm'
import type {NextPage} from 'next'
import {useRef} from 'react'
import {NextSeo} from 'next-seo'

const WorkshopPage = ({getLayout}: {getLayout: any}) => {
  const formRef = useRef<SignUpFormRef>(null)

  return (
    <main className="min-h-screen relative bg-white dark:bg-gray-900">
      <div className="relative">
        <div className="relative">
          <Hero formRef={formRef} />
          <Features />
        </div>
        {/* <WorkshopStructure /> */}
        <div className="relative">
          <SignUpForm ref={formRef} />
        </div>
        <div className="relative">
          <Instructor />
        </div>
      </div>
    </main>
  )
}

WorkshopPage.getLayout = (Page: any, pageProps: any) => {
  return (
    <Layout>
      <NextSeo
        title="Accelerate your development with Cursor"
        description="Join John Lindquist for an immersive workshop designed to help you conquer the frustration of getting stuck with complex AI tools."
        openGraph={{
          images: [
            {
              url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1739448881/cursor-workshop-card_2x_mibay4.jpg',
              width: 1200,
              height: 630,
            },
          ],
        }}
      />

      <Page {...pageProps} />
    </Layout>
  )
}

export default WorkshopPage
