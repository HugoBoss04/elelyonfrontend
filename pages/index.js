import Layout from '@/components/Layout'
import classes from '../styles/Home.module.css'
import Image from 'next/image'
import HeroImage from '../public/images/home-hero.jpg'
import { BsScissors } from 'react-icons/bs'
import FeaturedServices from '@/components/FeaturedServices'
import ClientGallery from '@/components/ClientGallery'
import ClientTestimonials from '@/components/ClientTestimonials'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <Layout>
      <div className='first-bg'>
        <div className={classes['hero-img-container']}>
          <Image
            src={HeroImage}
            fill
            alt='Hero Image'
            className={classes.img}
          />
          <div className={classes.overlay}></div>
          <h2 className={classes['hero-msg']}>
            Empowering Men With Impeccable Grooming and Style
          </h2>
          <button className={classes['hero-btn']}>
            book now
            <BsScissors size={16} className={classes['hero-scissors']} />
          </button>
        </div>
        <FeaturedServices />
        <ClientGallery />
        <ClientTestimonials />
        <Contact />
      </div>
    </Layout>
  )
}
