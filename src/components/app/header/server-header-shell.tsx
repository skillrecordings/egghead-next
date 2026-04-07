import Header from './index'
import {HeaderBannerProvider} from './banner-context'
import {getHeaderBannerData} from '@/server/header-banners'

export default async function ServerHeaderShell({route}: {route: string}) {
  let headerBannerData

  console.log(
    JSON.stringify({
      event: 'header.server_shell.load.start',
      route,
    }),
  )

  try {
    headerBannerData = await getHeaderBannerData({route})
    console.log(
      JSON.stringify({
        event: 'header.server_shell.load.success',
        route,
      }),
    )
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'header.server_shell.load.error',
        route,
        error_message: error instanceof Error ? error.message : String(error),
      }),
    )
    headerBannerData = undefined
  }

  return (
    <HeaderBannerProvider initialData={headerBannerData}>
      <Header />
    </HeaderBannerProvider>
  )
}
