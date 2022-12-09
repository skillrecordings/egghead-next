import AppLayout from 'components/app/layout'
import UserLayout from './components/user-layout'
import {BookmarksTabContent} from 'components/pages/user'

const Bookmarks = () => {
  return (
    <div className="min-h-[20rem]">
      <BookmarksTabContent />
    </div>
  )
}

export default Bookmarks

Bookmarks.getLayout = function getLayout(Page: any, pageProps: any) {
  return (
    <AppLayout>
      <UserLayout>
        <Page {...pageProps} />
      </UserLayout>
    </AppLayout>
  )
}
