import { useEffect, useState } from 'react';
import classes from '../styles/Contact.module.css';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1000);
  }, []);
  return (
    <div className={classes['contact-bg']}>
      <div className={classes.container}>
        <div className={classes.left}>
          <FaEnvelope size={22} className={classes.icon} />
          <p className={classes.value}>ariana.hernandez@salonlofts.com</p>
        </div>
        <div className={classes.middle}>
          <FaPhoneAlt size={22} className={classes.icon} />
          <a href="tel:+1-713-560-5371" className={classes.value}>
            <span
              className={`${classes['number-fix']} ${classes['telephone-number']}`}
            >
              713-560-5371
            </span>
          </a>
        </div>
        <div className={classes.right}>
          <FaMapMarkerAlt size={22} className={classes.value} />
          <p className={`${classes.value} ${classes['right-value']}`}>
            <span className={classes['number-fix']}>23541</span> Westheimer
            Pkwy, Katy, TX <span className={classes['number-fix']}>77494</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Contact;
