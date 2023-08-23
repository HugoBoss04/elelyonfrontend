import Layout from '@/components/Layout'
import classes from '../styles/About.module.css'
import HeroOne from '../public/images/about-hero-2.jpg'
import Image from 'next/image'

const AboutPage = () => {
  return (
    <Layout>
      <div className='first-bg'>
        <div className={classes['about-hero-container']}>
          <Image
            src={HeroOne}
            fill
            alt='Services Image'
            className={classes['img-1']}
          />
          <div className={classes.overlay}></div>
          <h2 className={classes['hero-msg']}>About</h2>
        </div>
        <div className={classes['content-container']}>
          <div className={classes['title-container']}>
            <div className={classes.line}></div>
            <div className={classes.title}>El Elyon</div>
            <div className={classes.line}></div>
          </div>
          <div className={classes['about-container']}>
            <p className={classes.heading}>Who We Are</p>
            <p className={classes.msg}>
              Welcome to our barbershop, where style meets tradition. With
              skilled barbers and a cozy atmosphere, we're dedicated to crafting
              the perfect look for you. Discover the best in grooming.
            </p>
          </div>
        </div>
        <div className={classes['about-hero-two-container']}>
          <div className={classes.overlay}></div>
        </div>
      </div>
    </Layout>
  )
}
export default AboutPage
