import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children, title, keywords, description, is404 }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
      </Head>
      <Navbar />
      {children}
      <Footer is404={is404} />
    </div>
  )
}
export default Layout
