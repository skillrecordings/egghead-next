import * as React from 'react'
import Head from 'next/head'
import type {GetServerSideProps} from 'next'
import EmailConfirmation from '@/components/pages/email-confirmation'
import {withSSRLogging} from '@/lib/logging'
import {
  drovrApiBaseUrl,
  firstParam,
  parseUnsubscribeChoice,
  readUnsubscribeState,
  unsubscribePageView,
  type UnsubscribeChoice,
  type UnsubscribeLookup,
  type UnsubscribePageView,
} from '@/lib/drovr-unsubscribe'
import {logEvent} from '@/utils/structured-log'

const SUPPORT_EMAIL = 'support@egghead.io'

type UnsubscribePageProps = {
  token: string
  view: UnsubscribePageView
}

// The page drovr's egghead email footers link to. drovr answers who the token
// belongs to and what they still get; this page shows it and posts the choice
// back through /api/unsubscribe. Opening the page changes nothing.
export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async function ({query}) {
    const token = firstParam(query.t)
    const choice = parseUnsubscribeChoice(query.choice)
    const updated = parseUnsubscribeChoice(query.updated)
    const error = firstParam(query.error)

    const lookup: UnsubscribeLookup =
      error === 'invalid'
        ? {status: 'invalid-token'}
        : await readUnsubscribeState(token, {baseUrl: drovrApiBaseUrl()})

    logEvent(
      lookup.status === 'unavailable' ? 'warn' : 'info',
      'unsubscribe_page.view',
      {
        result: lookup.status,
        preselected: choice,
        updated,
        ...(lookup.status === 'unavailable' ? {reason: lookup.reason} : {}),
      },
    )

    return {
      props: {
        token: token ?? '',
        view: unsubscribePageView(lookup, {
          choice,
          updated,
          submitFailed: error === 'unavailable',
        }),
      },
    }
  },
)

const Unsubscribe: React.FunctionComponent<UnsubscribePageProps> = ({
  token,
  view,
}) => (
  <EmailConfirmation>
    <Head>
      <title>Unsubscribe | egghead.io</title>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
    {view.kind === 'invalid' ? (
      <>
        <h1>This link isn't valid</h1>
        <p>
          It may be incomplete or copied wrong. Email <SupportLink /> and we'll
          unsubscribe you.
        </p>
      </>
    ) : view.kind === 'unavailable' ? (
      <>
        <h1>We can't load your email settings right now</h1>
        <p>
          Try again in a few minutes, or email <SupportLink /> and we'll
          unsubscribe you.
        </p>
      </>
    ) : view.kind === 'all-unsubscribed' ? (
      <>
        <p>
          egghead email for <strong>{view.email}</strong>
        </p>
        <h1>You're unsubscribed from all egghead email</h1>
        <p role={view.justUpdated ? 'status' : undefined}>
          {view.justUpdated
            ? "Done. You won't get any more emails from us."
            : "There's nothing else to do here."}
        </p>
      </>
    ) : (
      <>
        <p>
          egghead email for <strong>{view.email}</strong>
        </p>
        <h1>Unsubscribe</h1>
        {view.justUpdated ? (
          <p role="status">
            Done. You won't get any more emails from {view.courseName}.
          </p>
        ) : view.courseUnsubscribed ? (
          <p>You're already unsubscribed from {view.courseName}.</p>
        ) : null}
        {view.submitFailed ? (
          <p role="alert">
            That didn't go through. Please try again, or email <SupportLink />.
          </p>
        ) : null}
        <div className="not-prose flex flex-col gap-4">
          {view.options.map((option, index) => (
            <ChoiceForm
              key={option}
              token={token}
              choice={option}
              courseName={view.courseName}
              courseOff={view.courseUnsubscribed}
              primary={index === 0}
            />
          ))}
        </div>
      </>
    )}
  </EmailConfirmation>
)

function ChoiceForm({
  token,
  choice,
  courseName,
  courseOff,
  primary,
}: {
  token: string
  choice: UnsubscribeChoice
  courseName: string
  courseOff: boolean
  primary: boolean
}) {
  const label =
    choice === 'course'
      ? `Unsubscribe from ${courseName}`
      : 'Unsubscribe from all egghead email'
  const detail =
    choice === 'course'
      ? 'Stops these emails. Other egghead email still arrives.'
      : courseOff
      ? 'Stops every email from egghead.'
      : 'Stops every email from egghead, including these.'
  return (
    <form method="post" action="/api/unsubscribe" className="space-y-1">
      <input type="hidden" name="t" value={token} />
      <input type="hidden" name="choice" value={choice} />
      <button
        type="submit"
        className={
          primary
            ? 'w-full rounded-md bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700'
            : 'w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-900 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
        }
      >
        {label}
      </button>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {detail}
      </p>
    </form>
  )
}

function SupportLink() {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
        'Unsubscribe',
      )}`}
    >
      {SUPPORT_EMAIL}
    </a>
  )
}

export default Unsubscribe
