import classes from '../styles/FeaturedServices.module.css'
import ServiceOneImage from '../public/images/service-1-img.jpg'
import ServiceTwoImage from '../public/images/service-2-img.jpg'
import Image from 'next/image'
import { BsScissors } from 'react-icons/bs'
import { TbBottle } from 'react-icons/tb'
import Link from 'next/link'

const FeaturedServices = () => {
  return (
    <div className={classes.container}>
      <div className={classes['title-container']}>
        <div className={classes.line}></div>
        <div className={classes.title}>Featured Services</div>
        <div className={classes.line}></div>
      </div>
      <div className={classes['content-container']}>
        <div className={`${classes['service-1-container']}`}>
          <BsScissors size={40} className={classes.icon} />
          <h3 className={classes['service-title']}>Haircut & Beard</h3>
          <p className={classes.description}>
            Elevate your style with precision cuts and groomed beards at our
            barbershop
          </p>
        </div>
        <div className={`${classes['service-1-img-container']}`}>
          <Image
            src={ServiceOneImage}
            fill
            alt='Service 1 Customer'
            className={classes.img}
          />
        </div>
        <div className={`${classes['service-2-img-container']}`}>
          <Image
            src={ServiceTwoImage}
            fill
            alt='Service 2 Customer'
            className={classes.img}
          />
        </div>
        <div className={`${classes['service-2-container']}`}>
          <TbBottle size={40} className={classes['icon-2']} />
          <h3 className={classes['service-title-2']}>Rejuvenating Facial</h3>
          <p className={classes.description}>
            Elevate your style with precision cuts and groomed beards at our
            barbershop
          </p>
        </div>
        <Link href='/services' className={`${classes['service-btn']}`}>
          View All Services
        </Link>
      </div>
    </div>
  )
}
export default FeaturedServices
