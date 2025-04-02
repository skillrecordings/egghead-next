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

      {/* Skills Section */}
      <section className="py-16  dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            Essential Skills Your Team Will Master
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">The Core AI Workflow</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Implement a reliable 4-step process (Scaffold → Outline →
                Instruct → Execute) for tackling complex features and ensuring
                predictable AI assistance.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Precision Prompting</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Craft detailed, effective instructions using advanced models and
                web search for up-to-date, context-aware planning that delivers
                reliable results.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Debugging AI Failures</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Learn to systematically analyze agent errors and turn setbacks
                into valuable data for refining prompts and workflows for
                consistent results.
              </p>
            </div>
          </div>
        </div>
      </section>

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
              Request Quote
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
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 text-md">
                  Flexible scheduling for your team
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 text-md">
                  Full day of immersive training
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
