import * as React from 'react'
import {NextSeo} from 'next-seo'
import {CardResource} from 'types'
import {GetServerSideProps} from 'next'
import CourseGrid from 'components/pages/20-days-of-egghead/course-grid'
import {loadHolidayCourses} from 'lib/holiday-sale'

type EOYSale2021PageProps = {
  data: CardResource
}

const EOYSale2021Page: React.FC<EOYSale2021PageProps> & {getLayout?: any} = ({
  data,
}) => {
  return (
    <>
      <NextSeo noindex={true} title={'20 days of egghead'} />
      <div className="dark:bg-gray-900 bg-gray-50">
        <div className="container px-3">
          <CourseGrid data={data} />
        </div>
      </div>
    </>
  )
}

export default EOYSale2021Page

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  const data = await loadHolidayCourses()

  return {
    props: {
      data,
    },
  }
}
