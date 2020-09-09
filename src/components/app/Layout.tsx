import {FunctionComponent} from 'react'
import dynamic from 'next/dynamic'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'

let CommandBar: FunctionComponent = () => <></>

if (process.env.NODE_ENV == 'development' && process.env.NEXT_PUBLIC_DEVTOOLS) {
  CommandBar = dynamic(() => import('./CommandBar')) as FunctionComponent
}
const Layout: FunctionComponent = ({children}) => {
  return (
    <>
      <Header></Header>
      <CommandBar></CommandBar>
      <Main>{children}</Main>
      <Footer></Footer>
    </>
  )
}

export default Layout
