import { IoStarSharp } from 'react-icons/io5';
import classes from '@/styles/Rating.module.css';

const Rating = ({ rating }) => {
  return (
    <div className={classes['rating-container']}>
      <IoStarSharp size={24} className={`${classes.full}`} />
      <IoStarSharp
        size={24}
        className={`${rating >= 2 ? classes.full : classes.empty}`}
      />
      <IoStarSharp
        size={24}
        className={`${rating >= 3 ? classes.full : classes.empty}`}
      />
      <IoStarSharp
        size={24}
        className={`${rating >= 4 ? classes.full : classes.empty}`}
      />
      <IoStarSharp
        size={24}
        className={`${rating >= 5 ? classes.full : classes.empty}`}
      />
    </div>
  );
};

export default Rating;
