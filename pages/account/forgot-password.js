import Layout from '@/components/Layout';
import { useContext, useEffect, useState } from 'react';

import classes from '@/styles/ForgotPasswordPage.module.css';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from 'utils/AuthContext';

import aboutImg from '../../public/images/about-section-img.jpg';

import cookie from 'cookie';

const ForgotPasswordPage = () => {
  const { forgotPassword, error, setError, successMsg, setSuccessMsg } =
    useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
  });

  const changeHandler = (e) => {
    const property = e.target.name;
    setFormData({ ...formData, [property]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.email !== '' && formData.email) {
      console.log('ran');
      setError('');
      setSuccessMsg('');
      forgotPassword(formData.email);
    } else {
      setError('Enter email address associated with El Elyon');
    }
  };

  useEffect(() => {
    setError('');
    setSuccessMsg('');
  }, [formData]);

  return (
    <Layout title="El Elyon | Login">
      <div className={classes.bg}>
        <div className={classes.container}>
          <div className={classes['img-container']}>
            <Image src={aboutImg} alt="Haircut" fill className={classes.img} />
            <div className={classes.overlay}></div>
          </div>
          <div className={classes['form-container']}>
            <form onSubmit={submitHandler} className={classes.form}>
              <h2 className={classes.title}>Forgot Password</h2>
              <input
                type="email"
                name="email"
                className={classes.input}
                onChange={changeHandler}
                placeholder="Email"
                value={formData.email}
              />
              <div className={classes['btn-container']}>
                <button className={`${classes.btn}`}>Send</button>
              </div>
              {(error || successMsg) && (
                <p
                  className={`${classes['status-msg']} ${
                    error && classes['error-msg']
                  }`}
                >
                  {error ? error : successMsg}
                </p>
              )}
              <div className={classes['links-container']}>
                <Link href="/account/login" className={classes.link}>
                  Have an account?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ForgotPasswordPage;

export async function getServerSideProps(context) {
  const { req } = context;
  const browserCookie = req.headers.cookie;

  if (browserCookie) {
    const { token } = cookie.parse(browserCookie);

    if (token) {
      return {
        redirect: {
          destination: '/account/dashboard',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}
