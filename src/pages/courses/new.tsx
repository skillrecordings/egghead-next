import {Formik, Form, Field, ErrorMessage} from 'formik'
import {useAccount} from 'hooks/use-account'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {trpc} from 'trpc/trpc.client'

const NewCourse = () => {
  const {instructorId} = useAccount()
  const router = useRouter()

  const createCourseMutation = trpc.instructor.createDraftCourse.useMutation({
    onSuccess: (data) => {
      router.push(`/drafts/${data.slug}`)
    },
    onError: (error) => {
      toast.error(
        `There was a problem creating your course, reload and try again. Contact egghead staff if the issue persists.`,
        {
          duration: 6000,
          icon: '❌',
        },
      )
    },
  })

  return (
    <div className=" max-w-3xl mx-auto h-screen">
      <h1 className="text-center text-3xl leading-9 font-bold mt-4 mb-8">
        Create a Course
      </h1>
      <Formik
        initialValues={{courseTitle: '', courseDescription: ''}}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(true)
          createCourseMutation.mutate({
            title: values.courseTitle,
            description: values.courseDescription,
            instructorId,
          })
        }}
      >
        {({isSubmitting}) => (
          <Form className="flex flex-col items-center">
            <label
              htmlFor="courseTitle"
              className="block text-md font-medium text-gray-700 space-y-1 self-start"
            >
              <span className="dark:text-white">Course Title*</span>
            </label>
            <span className="dark:text-white text-slate-700 text-sm w-96 italic mb-2">
              A one sentance summary of your description below.
            </span>
            <Field
              name="courseTitle"
              type="text"
              required
              className="appearance-none block w-96 px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <label
              htmlFor="courseDescription"
              className="block text-md font-medium text-gray-700 space-y-1 self-start"
            >
              <span className="dark:text-white">Course Description*</span>
            </label>
            <span className="dark:text-white text-slate-700 text-sm w-96 italic mb-2">
              Give as much detail as you can here. What has you excited about
              teaching this course? What sparked this course idea?
            </span>
            <Field
              name="courseDescription"
              type="text"
              as="textarea"
              required
              className="appearance-none block w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              className={`text-center justify-center w-96 items-center mt-4 px-5 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default NewCourse
