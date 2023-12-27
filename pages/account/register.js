import Layout from '@/components/Layout';
import { useContext, useEffect } from 'react';

import classes from '@/styles/Login.module.css';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from 'utils/AuthContext';

import aboutImg from '../../public/images/about-section-img.jpg';

import cookie from 'cookie';

import { HiOutlineMail } from 'react-icons/hi';

const RegisterPage = () => {
  const {
    register,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    formData,
    setFormData,
    registerSuccess,
  } = useContext(AuthContext);

  const changeHandler = (e) => {
    const property = e.target.name;
    setFormData({ ...formData, [property]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setError('');
    register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      number: formData.number,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      reminderType: formData.reminderType,
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
          {!registerSuccess ? (
            <div className={classes['form-container']}>
              <form onSubmit={submitHandler} className={classes.form}>
                <h2 className={classes.title}>Register</h2>
                <input
                  type="text"
                  name="firstName"
                  className={classes.input}
                  onChange={changeHandler}
                  placeholder="First Name"
                  value={formData.firstName}
                />
                <input
                  type="text"
                  name="lastName"
                  className={classes.input}
                  onChange={changeHandler}
                  placeholder="Last Name"
                  value={formData.lastName}
                />
                <input
                  type="text"
                  name="number"
                  className={classes.input}
                  onChange={changeHandler}
                  placeholder="Phone Number (Ex: 123-123-1234)"
                  value={formData.number}
                />
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
                <input
                  type="password"
                  name="confirmPassword"
                  className={classes.input}
                  onChange={changeHandler}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                />
                <div className={classes['comms-container']}>
                  <p className={classes['comms-question']}>
                    How would you like to receive appointment reminders?
                  </p>
                  <input
                    type="radio"
                    id="textReminder"
                    name="reminderType"
                    value="text"
                    className={classes['input-radio']}
                    onChange={changeHandler}
                  />
                  <label
                    htmlFor="textReminder"
                    className={classes['label-text']}
                  >
                    Text
                  </label>

                  <input
                    type="radio"
                    id="emailReminder"
                    name="reminderType"
                    value="email"
                    className={classes['input-radio']}
                    onChange={changeHandler}
                  />
                  <label
                    htmlFor="emailReminder"
                    className={classes['label-text']}
                  >
                    Email
                  </label>

                  <input
                    type="radio"
                    id="bothReminder"
                    name="reminderType"
                    value="both"
                    className={classes['input-radio']}
                    onChange={changeHandler}
                  />
                  <label
                    htmlFor="bothReminder"
                    className={classes['label-text']}
                  >
                    Both
                  </label>
                </div>
                <div className={classes['btn-container']}>
                  <button type="submit" className={`${classes.btn}`}>
                    Register
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
                <div className={classes['links-container']}>
                  <Link href="/account/login" className={classes.link}>
                    Have an account?
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            <div className={classes['success-msg-container']}>
              <h2 className={classes.title}>Register</h2>
              <HiOutlineMail className={classes.icon} size={48} />
              <p className={`${classes['success-msg']}`}>
                Success!! Please check your email to confirm your account.
              </p>
              <p className={`${classes['success-msg-info']}`}>
                If you do not see an email, please wait a few minutes and be
                sure to check your spam box.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default RegisterPage;

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
