import Layout from '@/components/Layout';
import classes from '@/styles/ReviewPage.module.css';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import hero from '../public/images/review-page-hero.jpg';
import { BsChevronDown } from 'react-icons/bs';
import { useRouter } from 'next/router';
import AuthContext from '@/utils/AuthContext';
import ReviewPageSkeleton from '@/components/skeletons/ReviewPage';
import { NEXT_URL } from '../config';
import cookie from 'cookie';

const ReviewPage = () => {
  const { user, error, setError, successMsg, setSuccessMsg } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    review: '',
  });

  const router = useRouter();

  const handleSubmit = async () => {
    const { name, rating, review } = formData;
    const res = await fetch(`${NEXT_URL}/api/testimonials/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        rating,
        review,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      setSuccessMsg(
        'Success! Your review is being approved. Redirecting to homepage...'
      );
      setFormData({
        ...formData,
        rating: 5,
        review: '',
      });
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      setError(data.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...formData,
      rating: 5,
      review: '',
    });
    router.push('/');
  };
  useEffect(() => {
    if (user !== null) {
      setFormData({ ...formData, name: `${user.firstName} ${user.lastName}` });
      setLoading(false);
    }
  }, [user]);
  return (
    <Layout title="Write a Review | El Elyon">
      <div className="first-bg">
        <div className={classes.container}>
          <div className={classes['inputs-container']}>
            <h3 className={classes.header}>Rate Your Experience</h3>
            <div className={classes['inputs-row']}>
              <div className={classes['input-one']}>
                <label className={classes.label}>Name</label>
                {loading ? (
                  <ReviewPageSkeleton />
                ) : (
                  <>
                    <input
                      type="text"
                      className={classes.input}
                      disabled
                      value={formData.name}
                    />
                  </>
                )}
              </div>
              <div className={classes['input-two']}>
                <label className={classes.label}>Rating</label>
                <div className={classes['selection-container']}>
                  <select
                    id="servicesSelect"
                    name="services"
                    className={classes['rating-select']}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    value={formData.rating}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <BsChevronDown className={classes.icon} />
                </div>
              </div>
            </div>
            <label className={classes['textarea-label']}>Review</label>
            <textarea
              className={classes.textarea}
              value={formData.review}
              onChange={(e) =>
                setFormData({ ...formData, review: e.target.value })
              }
            />
            {(error || successMsg) && (
              <p className={`${error ? classes.error : classes.success}`}>{`${
                error ? error : successMsg
              }`}</p>
            )}
            <div className={classes['btns-container']}></div>
            <button className={classes['submit-btn']} onClick={handleSubmit}>
              Submit
            </button>
            <button className={classes['cancel-btn']} onClick={handleCancel}>
              Cancel
            </button>
          </div>
          <div className={classes['img-container']}>
            <Image
              src={hero}
              alt="Barbershop Image"
              fill
              className={classes.img}
            />
            <div className={classes.overlay}></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ReviewPage;

export async function getServerSideProps(context) {
  const { req } = context;
  const browserCookie = req.headers.cookie;

  if (browserCookie) {
    const { token } = cookie.parse(browserCookie);

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
