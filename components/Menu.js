import classes from '../styles/Menu.module.css'
import { BsChevronRight } from 'react-icons/bs'

const Menu = () => {
  return (
    <div className={classes.bg}>
      <div className={classes.container}>
        <div className={classes['option-container']}>
          <p className={classes.value}>Home</p>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div className={classes['option-container']}>
          <p className={classes.value}>Services</p>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div className={classes['option-container']}>
          <p className={classes.value}>About</p>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div className={classes['option-container']}>
          <p className={classes.value}>Contact</p>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
      </div>
    </div>
  )
}
export default Menu
