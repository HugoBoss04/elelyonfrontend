import Link from 'next/link';
import classes from '../styles/Service.module.css';
import { useContext } from 'react';
import AuthContext from '@/utils/AuthContext';

const Service = ({
  name,
  price,
  duration,
  additionalDetails,
  dashboard = false,
}) => {
  const { user } = useContext(AuthContext);
  const durationTrimmed = duration.split('x')[1].trim();
  const durationTrimmedSplit = durationTrimmed.split(' ');
  const durationNumber = durationTrimmedSplit[0];
  const durationLength = durationTrimmedSplit[1];
  return (
    <>
      <h3 className={classes.title}>
        {name}
        {additionalDetails !== '' && additionalDetails !== null && (
          <span className={classes.additional}> ({additionalDetails})</span>
        )}
      </h3>
      <div className={classes['info-one-container']}>
        <p className={classes.label}>Price</p>
        <div className={classes['line-container']}>
          <div className={classes.line}></div>
        </div>
        <p className={classes.value}>
          $<span className={classes['number-fix']}>{price.toFixed(2)}</span>
        </p>
      </div>
      <div className={classes['info-two-container']}>
        <p className={classes.label}>Duration</p>
        <div className={classes['line-container']}>
          <div className={classes.line}></div>
        </div>
        <p className={classes.value}>
          <span className={classes['number-fix']}>{durationNumber} </span>
          {durationLength}.
        </p>
      </div>
      {!dashboard && (
        <Link
          href={user.username !== '' ? '/account/dashboard' : '/account/login'}
          className={classes.btn}
        >
          BOOK APPOINTMENT
        </Link>
      )}
    </>
  );
};
export default Service;
