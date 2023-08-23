import classes from '../styles/Service.module.css'

const Service = ({ name, price, duration, additional }) => {
  return (
    <>
      <h3 className={classes.title}>
        {name}
        {additional !== '' && (
          <span className={classes.additional}> ({additional})</span>
        )}
      </h3>
      <div className={classes['info-one-container']}>
        <p className={classes.label}>Price</p>
        <div className={classes['line-container']}>
          <div className={classes.line}></div>
        </div>
        <p className={classes.value}>${price.toFixed(2)}</p>
      </div>
      <div className={classes['info-two-container']}>
        <p className={classes.label}>Duration</p>
        <div className={classes['line-container']}>
          <div className={classes.line}></div>
        </div>
        <p className={classes.value}>{duration}</p>
      </div>
      <button className={classes.btn}>BOOK APPOINTMENT</button>
    </>
  )
}
export default Service
