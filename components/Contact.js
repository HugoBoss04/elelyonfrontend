import classes from '../styles/Contact.module.css'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'

const Contact = () => {
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <FaEnvelope size={22} className={classes.icon} />
        <p className={classes.value}>ariana.hernandez@salonlofts.com</p>
      </div>
      <div className={classes.middle}>
        <FaPhoneAlt size={22} className={classes.icon} />
        <p className={classes.value}>(713)-560-5371</p>
      </div>
      <div className={classes.right}>
        <FaMapMarkerAlt size={22} className={classes.value} />
        <p className={`${classes.value} ${classes['right-value']}`}>
          23541 Westheimer Pkwy, Katy, TX 77494 - Loft 2
        </p>
      </div>
    </div>
  )
}
export default Contact
