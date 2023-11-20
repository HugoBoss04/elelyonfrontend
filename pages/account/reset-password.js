import Layout from '@/components/Layout';
import { useContext, useEffect, useState } from 'react';

import classes from '@/styles/Login.module.css';
import Image from 'next/image';
import AuthContext from 'utils/AuthContext';

import aboutImg from '../../public/images/about-section-img.jpg';

const ResetPasswordPage = ({ code }) => {
  const { resetPassword, error, setError, successMsg, setSuccessMsg } =
    useContext(AuthContext);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const changeHandler = (e) => {
    const property = e.target.name;
    setFormData({ ...formData, [property]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    resetPassword({
      code,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
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
              <h2 className={classes.title}>Enter New Password</h2>
              <input
                type="password"
                name="password"
                className={classes.input}
                onChange={changeHandler}
                placeholder="Password"
                value={formData.password}
              />
              <input
                type="password"
                name="confirmPassword"
                className={classes.input}
                onChange={changeHandler}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
              />
              <div className={classes['btn-container']}>
                <button type="submit" className={`${classes.btn}`}>
                  Submit
                </button>
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
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ResetPasswordPage;

export async function getServerSideProps(query) {
  const code = query.query.code;

  if (!code) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: { code },
  };
}
