import * as React from 'react'

import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'
import {BookmarksList} from 'components/pages/user/components'

const BookmarksTabContent: React.FC<React.PropsWithChildren<any>> = () => {
  return (
    <div className="space-y-10 md:space-y-14 xl:space-y-16">
      <ItemWrapper title="Bookmarks">
        <BookmarksList />
      </ItemWrapper>
    </div>
  )
}

export default BookmarksTabContent
