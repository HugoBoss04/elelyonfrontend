import classes from '@/styles/SkeletonReviewPage.module.css';

const ReviewPageSkeleton = () => {
  return (
    <div className={classes['skeleton-wrapper']}>
      <div className={`${classes.skeleton} ${classes['skeleton-name']}`}></div>
    </div>
  );
};
export default ReviewPageSkeleton;
