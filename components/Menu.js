import Link from 'next/link'
import classes from '../styles/Menu.module.css'
import { BsChevronRight } from 'react-icons/bs'

const Menu = () => {
  return (
    <div className={classes.bg}>
      <div className={classes.container}>
        <div className={classes['option-container']}>
          <Link href='/' className={classes.value}>
            Home
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div className={classes['option-container']}>
          <Link href='/services' className={classes.value}>
            Services
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div className={classes['option-container']}>
          <Link href='/about' className={classes.value}>
            About
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div className={classes['option-container']}>
          <Link href='/' className={classes.value}>
            Contact
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
      </div>
    </div>
  )
}
export default Menu
