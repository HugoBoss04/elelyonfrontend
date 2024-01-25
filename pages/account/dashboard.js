import { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import Calendar from '@/components/appt/Calendar';
import Services from '@/components/appt/Services';
import Barbers from '@/components/appt/Barbers';
import Times from '@/components/appt/Times';
import Service from '@/components/Service';
import ConfirmAppt from '@/components/appt/ConfirmAppt';
import classes from '@/styles/Dashboard.module.css';

import { API_URL, NEXT_URL } from '@/config/index';
import AuthContext from '@/utils/AuthContext';

import { BsScissors } from 'react-icons/bs';
import { IoArrowBackOutline } from 'react-icons/io5';

import qs from 'qs';
import cookie from 'cookie';
import DashboardSkeleton from '@/components/skeletons/Dashboard';

const DashboardPage = ({ allCollections, appts }) => {
  const { logout, user, error, setError } = useContext(AuthContext);
  const [deleteState, setDeleteState] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('');

  const { services, barbers, schedules } = allCollections.data[0].attributes;

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDelete = async () => {
    const id = user.appointment.id;
    const res = await fetch(`${NEXT_URL}/api/appt/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (res.ok) {
      router.reload();
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  const convertDateFormat = (inputDate) => {
    // Split the input date string by hyphen

    const [year, month, day] = inputDate.split('-');

    // Array of month names
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Convert the month number to its name
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Return the formatted date string
    return `${monthName} ${parseInt(day, 10)}, ${year}`;
  };

  function formatTimeString(inputTime) {
    // Split the input string by colon to extract hours, minutes, and seconds
    const [hours, minutes] = inputTime.split(':');

    // Convert the hours to a number
    const numericHours = parseInt(hours, 10);

    // Determine the AM/PM value based on the hour
    const amOrPm = numericHours >= 8 && numericHours < 12 ? 'AM' : 'PM';

    // Convert the 24-hour format to 12-hour format
    const adjustedHours = numericHours % 12 || 12;

    // Return the formatted time string
    return `${adjustedHours.toString().padStart(2, '0')}:${minutes} ${amOrPm}`;
  }

  useEffect(() => {
    if (user) {
      setSelectedService(
        services.data.filter((service) => {
          return service.attributes.name === user?.appointment?.service?.name;
        })
      );
      setLoading(false);
    }
  }, [activeStep, user]);

  if (loading) {
    return <DashboardSkeleton />;
  } else {
    return (
      <Layout title="El Elyon | My Profile">
        <div className="first-bg">
          <div className={classes.container}>
            <h2 className={classes.greeting}>Hi {user?.firstName},</h2>
            {user?.appointment?.date && user?.appointment?.time ? (
              <>
                <h4 className={classes.msg}>
                  Here is your upcoming appointment:
                </h4>
                <div className={classes['appt-container']}>
                  <div className={classes['header-section']}>
                    <h2
                      className={`${classes.header} ${classes['header-mobile']}`}
                    >
                      El Elyon -{' '}
                      <p
                        className={`${classes.subheader} ${classes['subheader-mobile']}`}
                      >
                        {' '}
                        23541 Westheimer Pkwy, Katy, TX 77494
                      </p>
                    </h2>
                  </div>
                  <div className={classes['info-section-one']}>
                    <h4 className={classes['info-text']}>
                      {`${convertDateFormat(
                        user?.appointment?.date
                      )} - ${formatTimeString(user?.appointment?.time)}`}
                    </h4>
                    <h4
                      className={classes['info-text']}
                    >{`Barber: ${user?.appointment?.barbers[0]?.name}`}</h4>
                  </div>
                  <div className={classes['info-section-two']}>
                    <h4 className={classes['info-text']}>
                      {`Requested Service: ${user?.appointment?.service?.name} - $${selectedService[0]?.attributes?.price}`}
                    </h4>
                    <h4 className={classes['info-text']}>
                      Estimated Duration: 30 min.
                    </h4>
                  </div>
                  {deleteState && (
                    <div className={classes['delete-section']}>
                      <p className={classes['delete-msg']}>
                        Are you sure you want to cancel your appointment?
                      </p>
                      <div className={classes['btns-container']}>
                        <button
                          className={classes['delete-btn']}
                          onClick={handleDelete}
                        >
                          Cancel appointment
                        </button>
                        <button
                          className={classes['keep-btn']}
                          onClick={() => setDeleteState(false)}
                        >
                          Keep it
                        </button>
                      </div>
                    </div>
                  )}
                  {!deleteState && (
                    <div className={classes['options-section']}>
                      <p
                        className={classes['option-msg']}
                        onClick={() => setDeleteState(true)}
                      >
                        Need to cancel?
                      </p>
                    </div>
                  )}
                  {error && (
                    <p
                      className={`${classes['status-msg']} ${
                        error && classes['error-msg']
                      }`}
                    >
                      {error}
                    </p>
                  )}
                </div>
                <button
                  className={`${classes.btn} ${classes['logout-btn']} ${classes['appt-present-logout-btn']}`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <h4 className={classes.msg}>
                  You do not have an appointment scheduled at this moment.
                </h4>
                <button
                  className={classes.btn}
                  onClick={() => setActiveStep(1)}
                >
                  Schedule Now <BsScissors />
                </button>
                <button
                  className={`${classes.btn} ${classes['logout-btn']}`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <div className={classes['featured-container']}>
                  <div className={classes['title-container']}>
                    <div className={classes.line}></div>
                    <div className={classes.title}>Featured Services</div>
                    <div className={classes.line}></div>
                  </div>
                  <ul className={classes['services-container']}>
                    {services.data.slice(0, 3).map((service, index) => {
                      const { name, price, duration, additionalDetails } =
                        service.attributes;
                      return (
                        <li className={classes.service} key={index}>
                          <Service
                            name={name}
                            price={price}
                            duration={duration}
                            additionalDetails={additionalDetails}
                            dashboard={true}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
        {activeStep > 0 && (
          <div className={classes['schedule-overlay']}>
            <div className={classes.overlay}></div>
            <div className={classes['schedule-container']}>
              <div className={classes['header-container']}>
                <IoArrowBackOutline
                  size={20}
                  className={classes['back-arrow-icon']}
                  onClick={() => setActiveStep((prev) => prev - 1)}
                />
                <h3 className={classes['schedule-header']}>
                  {activeStep === 1
                    ? 'Please select a service:'
                    : activeStep === 2
                    ? 'Please select a barber:'
                    : activeStep === 3
                    ? 'Please select a date:'
                    : activeStep === 4
                    ? 'Please select a time:'
                    : 'Here are your appointment details:'}
                </h3>
                <p className={classes.close} onClick={() => setActiveStep(0)}>
                  x
                </p>
              </div>
              {activeStep === 1 && (
                <Services services={services} setActiveStep={setActiveStep} />
              )}
              {activeStep === 2 && (
                <Barbers barbers={barbers} setActiveStep={setActiveStep} />
              )}
              {activeStep === 3 && (
                <Calendar
                  setActiveStep={setActiveStep}
                  barbers={barbers}
                  schedules={schedules}
                />
              )}
              {activeStep === 4 && (
                <Times
                  setActiveStep={setActiveStep}
                  barbers={barbers}
                  appts={appts}
                />
              )}
              {activeStep === 5 && (
                <ConfirmAppt setActiveStep={setActiveStep} />
              )}
            </div>
          </div>
        )}
      </Layout>
    );
  }
};
export default DashboardPage;

export async function getServerSideProps(context) {
  const { req } = context;
  const browserCookie = req.headers.cookie;

  if (!browserCookie) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
    };
  }

  const { token } = cookie.parse(browserCookie);

  if (!token) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
    };
  }

  if (token) {
    const strapiRes = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await strapiRes.json();

    if (data.username === 'admin') {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  }

  const query = qs.stringify({
    populate: {
      barbers: {
        populate: ['appointments', 'schedules'],
      },
      services: true,
      schedules: true,
    },
  });

  const res = await fetch(`${API_URL}/api/all-collections?${query}`);
  const allCollections = await res.json();

  const res2 = await fetch(`${API_URL}/api/appointments?populate=*`);
  const appointments = await res2.json();

  return {
    props: { allCollections, appts: appointments },
  };
}
