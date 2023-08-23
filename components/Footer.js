import classes from '../styles/Footer.module.css'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className={classes.bg}>
      <div className={classes.container}>
        <Link href='#' className={classes.logo}>
          El Elyon
        </Link>
        <div className={classes['links-container']}>
          <Link href='#' className={classes.link}>
            Services
          </Link>
          <Link href='#' className={classes.link}>
            About
          </Link>
          <Link href='#' className={classes.link}>
            Contact
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Footer
