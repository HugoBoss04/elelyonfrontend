import Layout from '@/components/Layout';
import { useContext, useEffect, useState } from 'react';

import classes from '@/styles/Login.module.css';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from 'utils/AuthContext';

import aboutImg from '../../public/images/about-section-img.jpg';

import cookie from 'cookie';

const LoginPage = () => {
  const { login, error, setError, successMsg, setSuccessMsg } =
    useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const changeHandler = (e) => {
    const property = e.target.name;
    setFormData({ ...formData, [property]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    login({
      email: formData.email,
      password: formData.password,
    });
  };

  useEffect(() => {
    setSuccessMsg('');
    setError('');
  }, []);

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
              <h2 className={classes.title}>Login</h2>
              <input
                type="email"
                name="email"
                className={classes.input}
                onChange={changeHandler}
                placeholder="Email"
                value={formData.email}
              />
              <input
                type="password"
                name="password"
                className={classes.input}
                onChange={changeHandler}
                placeholder="Password"
                value={formData.password}
              />
              <div className={classes['btn-container']}>
                <button className={`${classes.btn}`}>Login</button>
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
                <Link href="/account/register" className={classes.link}>
                  Create account
                </Link>
                <Link href="/account/forgot-password" className={classes.link}>
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default LoginPage;

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
