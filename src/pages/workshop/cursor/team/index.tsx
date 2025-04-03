import {ContactForm} from '@/components/workshop/cursor/team/contact-form'
import {WorkshopBenefits} from '@/components/workshop/cursor/team/workshop-benefits'
import {WorkshopContent} from '@/components/workshop/cursor/team/workshop-content'
import {WorkshopAudience} from '@/components/workshop/cursor/team/workshop-audience'
import {WorkshopValue} from '@/components/workshop/cursor/team/workshop-value'
import {ArrowRight, Calendar, Clock, MapPin} from 'lucide-react'
import Image from 'next/image'
import Instructor from '@/components/workshop/cursor/Instructor'
import Hero, {
  SignUpFormRef,
  scrollTo,
} from '@/components/workshop/cursor/team/hero'
import {useRef} from 'react'

export default function Home() {
  const formRef = useRef<SignUpFormRef>(null)
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-slate-900 dark:text-white">
      {/* Hero Section */}
      <Hero formRef={formRef} />

      {/* Main Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Problem Statement */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Is your team struggling to effectively integrate AI into your
              development lifecycle?
            </h2>
            <div className="bg-gray-50 dark:bg-[#1a1f2e] p-8 rounded-lg border border-gray-200 dark:border-gray-800 max-w-3xl mx-auto shadow-sm">
              <WorkshopBenefits />
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              What Your Team Will Learn & Master
            </h2>
            <div className="bg-gray-50 dark:bg-[#1a1f2e] p-8 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
              <WorkshopContent />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-16 py-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to Take Advantage of AI Development with Cursor?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Claim a workshop for your team designed to level up your
              development process. Overcome the frustration of complex
              integrations, learn to handle failures gracefully, and discover
              powerful planning strategies to keep you shipping code with
              confidence.
            </p>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, formRef)}
              className="relative inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-12 px-8 rounded-md sm:mt-5 dark:bg-white dark:text-black bg-black text-white text-lg font-semibold w-fit"
            >
              Contact Us
            </a>
          </div>

          {/* Who Is This For */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Who Is This Workshop For?
            </h2>
            <WorkshopAudience />
          </div>

          {/* Why This Workshop */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Why This Workshop?
            </h2>
            <WorkshopValue />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800 shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-center">
              Become More Productive with Cursor
            </h2>

            <div className="flex flex-col mb-8 gap-3 w-fit mx-auto">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-black dark:text-white" />
                <span className="text-sm text-gray-700 dark:text-gray-300 text-md">
                  Flexible scheduling for your team
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-black dark:text-white" />
                <span className="text-sm text-gray-700 dark:text-gray-300 text-md">
                  Full day of immersive training
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-black dark:text-white" />
                <span className="text-sm text-gray-700 dark:text-gray-300 text-md">
                  Remote on Zoom
                </span>
              </div>
            </div>

            {/* Contact Form */}
            <div id="contact">
              <h3 className="text-md font-bold mb-4">
                Fill out the form below to request a quote for your team:
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Instructor />
    </div>
  )
}
