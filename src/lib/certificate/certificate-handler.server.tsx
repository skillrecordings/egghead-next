import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'
import {loadCourse} from '@/lib/courses'
import {loadCurrentUser} from '@/lib/users'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'

const larsseitFont = fetch(
  new URL('../../../public/fonts/larsseit.woff', import.meta.url),
).then((res) => res.arrayBuffer())

export default async function handleCreateCertificate(req: NextRequest) {
  const larsseitFontData = await larsseitFont

  try {
    const {searchParams} = new URL(req.url)

    const user = await loadCurrentUser(
      req?.cookies?.get(ACCESS_TOKEN_KEY)?.value ?? '',
    )

    const issuedDate = new Date().toLocaleDateString()
    const hasName = searchParams.has('name')
    if (!hasName) {
      return new Response(`Please provide a name`, {
        status: 400,
      })
    }
    const name = hasName ? searchParams.get('name') : user?.first_name

    // module
    const hasModule = searchParams.has('moduleId')
    const moduleId = searchParams.get('moduleId')
    const module = hasModule ? await loadCourse(moduleId as string) : {}

    const getCertificate = () => {
      switch (true) {
        case hasModule:
          return <ModuleTemplate />
          break
        default:
          throw Error
      }
    }

    const ModuleTemplate = () => {
      return (
        <div
          tw="flex w-full relative items-center h-full justify-center"
          style={{
            backgroundColor: '#0A1020',
            backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}/images/egghead-course-certificate-template.svg')`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* <p
            tw="text-3xl absolute top-18 right-20"
            style={{fontFamily: 'Magnat Text'}}
          >
            Certificate of Completion
          </p> */}
          <div tw="flex flex-col items-center justify-center h-full">
            <img
              src={module.square_cover_480_url}
              width={350}
              height={350}
              tw="absolute top-24"
            />
            <div tw="flex flex-col items-center justify-center mt-72">
              <p
                tw="text-7xl leading-none flex pb-10 text-gray-700"
                style={{fontFamily: 'Magnat Head Extrabold'}}
              >
                {name}
              </p>
              <div>
                <p
                  tw="text-center text-2xl font-sans flex"
                  style={{fontFamily: 'Larsseit'}}
                >
                  Has successfully completed:
                </p>
                <p>
                  <span tw="text-4xl font-semibold text-gray-700">
                    {module.title}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div
            tw="absolute text-2xl text-right right-16 bottom-24 flex"
            style={{fontFamily: 'Larsseit'}}
          >
            {issuedDate}
          </div>
        </div>
      )
    }

    return new ImageResponse(getCertificate(), {
      width: 1684,
      height: 1190,
      fonts: [
        {
          name: 'Larsseit',
          data: larsseitFontData,
          style: 'normal',
          weight: 500,
        },
      ],
    })
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the certificate`, {
      status: 500,
    })
  }
}
