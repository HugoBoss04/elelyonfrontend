import classes from '../styles/FeaturedServices.module.css';
import ServiceOneImage from '../public/images/service-1-img.jpg';
import ServiceTwoImage from '../public/images/service-2-img.jpg';
import Image from 'next/image';
import { BsScissors } from 'react-icons/bs';
import { TbBottle } from 'react-icons/tb';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const FeaturedServices = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1000);
  }, []);
  return (
    <div className={classes.container}>
      <div className={classes['title-container']}>
        <div className={classes.line}></div>
        <div className={classes.title}>Featured Services</div>
        <div className={classes.line}></div>
      </div>
      <div className={classes['content-container']}>
        {!isDesktop ? (
          <div className={`${classes['service-1-container']}`}>
            <BsScissors size={40} className={classes.icon} />
            <h3 className={classes['service-title']}>Haircut & Beard</h3>
            <p className={classes.description}>
              Elevate your style with precision cuts and groomed beards at our
              barbershop
            </p>
          </div>
        ) : (
          <div className={classes['services-container']}>
            <div className={classes['service']}>
              <p className={classes.label}>Men's Haircut</p>
              <div className={classes['line-container']}>
                <div className={classes['service-line']}></div>
              </div>
              <p className={`${classes.value} ${classes['number-fix']}`}>
                $35.00
              </p>
            </div>
            <div className={classes['service']}>
              <p className={classes.label}>Boy's Haircut</p>
              <div className={classes['line-container']}>
                <div className={classes['service-line']}></div>
              </div>
              <p className={`${classes.value} ${classes['number-fix']}`}>
                $25.00
              </p>
            </div>
            <div className={classes['service']}>
              <p className={classes.label}>Haircut & Beard</p>
              <div className={classes['line-container']}>
                <div className={classes['service-line']}></div>
              </div>
              <p className={`${classes.value} ${classes['number-fix']}`}>
                $65.00
              </p>
            </div>
            <div className={classes['service']}>
              <p className={classes.label}>Elite Treatment</p>
              <div className={classes['line-container']}>
                <div className={classes['service-line']}></div>
              </div>
              <p className={`${classes.value} ${classes['number-fix']}`}>
                $49.00
              </p>
            </div>
            <div className={classes['service']}>
              <p className={classes.label}>Royal Treatment</p>
              <div className={classes['line-container']}>
                <div className={classes['service-line']}></div>
              </div>
              <p className={`${classes.value} ${classes['number-fix']}`}>
                $49.00
              </p>
            </div>
            <button className={classes['desktop-service-btn']}>
              view all services
              <BsScissors
                size={20}
                className={classes['desktop-scissor-icon']}
              />
            </button>
          </div>
        )}
        <div className={`${classes['service-1-img-container']}`}>
          <Image
            src={ServiceOneImage}
            fill
            alt="Service 1 Customer"
            className={classes.img}
          />
        </div>
        <div className={`${classes['service-2-img-container']}`}>
          <Image
            src={ServiceTwoImage}
            fill
            alt="Service 2 Customer"
            className={classes.img}
          />
        </div>
        {!isDesktop ? (
          <div className={`${classes['service-2-container']}`}>
            <TbBottle size={40} className={classes['icon-2']} />
            <h3 className={classes['service-title-2']}>Rejuvenating Facial</h3>
            <p className={classes.description}>
              Elevate your style with precision cuts and groomed beards at our
              barbershop
            </p>
          </div>
        ) : (
          <div className={classes['msg-container']}>
            <h3 className={classes.heading}>Why El Elyon?</h3>
            <p className={classes.msg}>
              Indulge in a grooming journey like no other at our barbershop.
              With premium services tailored to your preferences and our
              unwavering commitment to satisfaction, you'll leave with a haircut
              that defines perfection.
            </p>
          </div>
        )}
        {!isDesktop && (
          <Link href="/services" className={`${classes['service-btn']}`}>
            View All Services
          </Link>
        )}
      </div>
    </div>
  );
};
export default FeaturedServices;
