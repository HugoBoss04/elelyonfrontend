import classes from '@/styles/SkeletonDashboard.module.css';
import Layout from '../Layout';

const DashboardSkeleton = () => {
  return (
    <Layout title="El Elyon | My Profile">
      <div className="first-bg-skeleton">
        <div className={classes['skeleton-container']}>
          <div className={classes['skeleton-header']}>
            <div className={classes['skeleton-menu']}></div>
          </div>
          <div className={classes['skeleton-welcome']}>
            <div
              className={`${classes['skeleton-text']} ${classes['skeleton-long']} ${classes['skeleton-animatedBackground']}`}
            ></div>
            <div
              className={`${classes['skeleton-text']} ${classes['skeleton-long']} ${classes['skeleton-animatedBackground']}`}
            ></div>
          </div>
          <div className={classes['skeleton-content']}>
            <div className={classes['skeleton-box']}>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-short']} ${classes['skeleton-animatedBackground']}`}
              ></div>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-small']} ${classes['skeleton-animatedBackground']}`}
              ></div>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-small']} ${classes['skeleton-animatedBackground']}`}
              ></div>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-small']} ${classes['skeleton-animatedBackground']}`}
              ></div>
            </div>
            <div className={classes['skeleton-box']}>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-short']} ${classes['skeleton-animatedBackground']}`}
              ></div>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-small']} ${classes['skeleton-animatedBackground']}`}
              ></div>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-small']} ${classes['skeleton-animatedBackground']}`}
              ></div>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-small']} ${classes['skeleton-animatedBackground']}`}
              ></div>
            </div>
            <div className={classes['skeleton-box']}>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-short']} ${classes['skeleton-animatedBackground']}`}
              ></div>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-small']} ${classes['skeleton-animatedBackground']}`}
              ></div>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-small']} ${classes['skeleton-animatedBackground']}`}
              ></div>
              <div
                className={`${classes['skeleton-text']} ${classes['skeleton-small']} ${classes['skeleton-animatedBackground']}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default DashboardSkeleton;
