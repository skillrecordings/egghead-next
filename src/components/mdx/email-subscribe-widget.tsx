import Image from 'next/image'
import {Formik, Field, Form} from 'formik'
import useCio from 'hooks/use-cio'

const EmailSubscribeWidget = (props: any) => {
  const {subscriber, cioIdentify} = useCio()

  return (
    <div className="grid sm:grid-cols-2 border-2 border-gray-300 rounded-md">
      <div className="flex flex-col prose prose-dark bg-gray-800 w-full p-8 rounded-l-md">
        <h2 className="text-3xl leading-tight font-bold">
          Ready to pick up the pace?
        </h2>
        <p className="py-2">
          enter your email and receive regular updates on our latest articles
          and courses
        </p>
        <Formik
          initialValues={{
            email: '',
            portfolio: true,
            fullStack: false,
            typescript: false,
          }}
          onSubmit={async (values) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
            }, 500)
          }}
        >
          {({values}) => (
            <Form className="flex flex-col">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="text-black"
              />
              <p className="pt-8 pb-2 text-lg font-semibold leading-snug">
                What do you want to take to the next level?
              </p>
              <label className="pb-1">
                <Field type="checkbox" name="portfolio" />
                <span className="pl-2">Portfolio Building</span>
              </label>
              <label className="pb-1">
                <Field type="checkbox" name="fullStack" />
                <span className="pl-2">Full-Stack in 2023</span>
              </label>
              <label className="pb-4">
                <Field type="checkbox" name="typescript" />
                <span className="pl-2">TypeScript</span>
              </label>
              <button
                className="bg-blue-600 rounded-md font-semibold p-1"
                type="submit"
              >
                SIGN UP
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="hidden sm:flex sm:flex-col p-6 rounded-r-md text-gray-800">
        <h2 className="text-3xl leading-tight font-bold">Your time matters.</h2>
        <p className="py-2">
          Our tutorials will respect it and keep you up to date.
        </p>
        <div className="flex flex-col h-full w-full justify-center">
          <div className="flex flex-row justify-center">
            <Image
              width={280}
              height={280}
              src="https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/490/full/EGH_BeginnersReact2.png"
            ></Image>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailSubscribeWidget
