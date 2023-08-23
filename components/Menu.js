import Link from 'next/link'
import classes from '../styles/Menu.module.css'
import { BsChevronRight } from 'react-icons/bs'
import { useRouter } from 'next/router'

const Menu = () => {
  const router = useRouter()
  return (
    <div className={classes.bg}>
      <div className={classes.container}>
        <div
          className={classes['option-container']}
          onClick={() => router.push('/')}
        >
          <Link href='/' className={classes.value}>
            Home
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div
          className={classes['option-container']}
          onClick={() => router.push('/services')}
        >
          <Link href='/services' className={classes.value}>
            Services
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div
          className={classes['option-container']}
          onClick={() => router.push('/about')}
        >
          <Link href='/about' className={classes.value}>
            About
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div
          className={classes['option-container']}
          onClick={() => router.push('/')}
        >
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
