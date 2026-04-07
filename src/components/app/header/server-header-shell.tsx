import Header from './index'
import {HeaderBannerProvider} from './banner-context'
import {getHeaderBannerData} from '@/server/header-banners'

export default async function ServerHeaderShell({route}: {route: string}) {
  const headerBannerData = await getHeaderBannerData({route})

  return (
    <HeaderBannerProvider initialData={headerBannerData}>
      <Header />
    </HeaderBannerProvider>
  )
}
