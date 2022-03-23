import * as React from 'react'
import {NextSeo} from 'next-seo'
import {CardResource} from 'types'
import {GetServerSideProps} from 'next'
import CourseGrid from 'components/pages/20-days-of-egghead/course-grid'
import {loadHolidayCourses} from 'lib/sale'

type EOYSale2021PageProps = {
  data: CardResource
}

const EOYSale2021Page: React.FC<EOYSale2021PageProps> & {getLayout?: any} = ({
  data,
}) => {
  const title = '20 days of egghead'
  const description =
    "We'll be releasing 20 badass courses during the holiday season, that will help you jumpstart your career in 2022."

  return (
    <>
      <NextSeo
        noindex={true}
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          images: [
            {
              url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1639991214/egghead-next-pages/20-days-of-egghead/default-card_2x.png',
            },
          ],
        }}
      />
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
