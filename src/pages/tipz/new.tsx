import React from 'react'
import CreateTipForm from '@/module-builder/create-tip-form'
import Layout from '@/components/app/layout'
import {Alert, AlertDescription} from '@/ui'
import {AlertTitle} from '@/ui'
import {GrInfo} from 'react-icons/gr'

const NewTip = () => {
  return (
    <Layout>
      <header className="py-10">
        <h1 className="text-center text-3xl font-bold">Create a New Tip</h1>
      </header>
      <main className="mx-auto w-full max-w-lg px-3">
        <Alert>
          <GrInfo className="h-4 w-4 dark:invert" />
          <AlertTitle>First upload a video</AlertTitle>
          <AlertDescription>
            When your video upload has been completed you will be able to add a
            tile and additional details to your tip.
          </AlertDescription>
        </Alert>
        <br />
        <CreateTipForm />
      </main>
    </Layout>
  )
}

export default NewTip
