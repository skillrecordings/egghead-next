import * as React from 'react'

import WidgetWrapper from 'components/pages/user/components/widget-wrapper'
import {BookmarksList} from 'components/pages/user/components'

const BookmarksTabContent: React.FC<any> = () => {
  return (
    <div className="space-y-10">
      <WidgetWrapper title="Bookmarks">
        <BookmarksList />
      </WidgetWrapper>
    </div>
  )
}

export default BookmarksTabContent
