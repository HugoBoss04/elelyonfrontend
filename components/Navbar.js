import { useState } from 'react'
import classes from '../styles/Navbar.module.css'
import Link from 'next/link'
import Menu from './Menu'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className={classes.bg}>
        <div className={classes.container}>
          <Link href='/' className={classes.logo}>
            El Elyon
          </Link>
          <div
            className={`${classes['menu-icon']} ${isOpen && classes.open}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className={`${classes.line} ${classes.top}`}></div>
            <div className={`${classes.line} ${classes.middle}`}></div>
            <div className={`${classes.line} ${classes.bottom}`}></div>
          </div>
        </div>
      </div>
      <div
        className={`${classes['mobile-menu-wrapper']} ${
          isOpen && classes.open
        }`}
      >
        <Menu />
      </div>
    </>
  )
}
export default Navbar
