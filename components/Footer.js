import classes from '../styles/Footer.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaInstagram, FaGoogle } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';

const Footer = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1000);
  }, []);
  return (
    <div className={classes.bg}>
      <div className={classes.container}>
        <div className={classes['first-section']}>
          <Link href="/" className={classes.logo}>
            El Elyon
          </Link>
          <div className={classes['links-container']}>
            <Link href="/services" className={classes['social-link-container']}>
              <FaGoogle
                size={isDesktop ? 24 : 18}
                className={classes['social-link']}
              />
            </Link>
            <Link href="/about" className={classes['social-link-container']}>
              <FaInstagram
                size={isDesktop ? 28 : 22}
                className={classes['social-link']}
              />
            </Link>
          </div>
        </div>
        <div className={classes['second-section']}>
          <div className={classes['first-column']}>
            <p className={classes.heading}>Explore</p>
            <Link href="#" className={classes.link}>
              All Services
            </Link>
            <Link href="#" className={classes.link}>
              About
            </Link>
            <Link href="#" className={classes.link}>
              Contact
            </Link>
          </div>
          <div className={classes['second-column']}>
            <p className={classes.heading}>Services</p>
            <Link href="#" className={classes.link}>
              Men's Haircut
            </Link>
            <Link href="#" className={classes.link}>
              Facial Treatment
            </Link>
            <Link href="#" className={classes.link}>
              Beard Trim
            </Link>
          </div>
          <div className={classes['third-column']}>
            <p className={classes.heading}>Hours</p>
            <p className={classes.text}>
              {isDesktop ? (
                'Mon - Fri:'
              ) : (
                <FiClock size={18} className={classes['clock-icon']} />
              )}{' '}
              <span className={classes['number-fix']}>9</span> AM -{' '}
              <span className={classes['number-fix']}>6</span> PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
