import Layout from '@/components/Layout';
import { useContext, useEffect, useState } from 'react';

import classes from '@/styles/AdminDashboard.module.css';

import AuthContext from 'utils/AuthContext';

import cookie from 'cookie';

import { BsChevronDown } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { API_URL, NEXT_URL } from '@/config/index';
import { useRouter } from 'next/router';

const AdminDashboardPage = ({ barbers, allAppointments, allWalkIns }) => {
  const { error, setError, successMsg, setSuccessMsg, logout } =
    useContext(AuthContext);
  const [appointments, setAppointments] = useState(allAppointments.data);
  const [walkIns, setWalkIns] = useState(allWalkIns.data);
  const [waitingList, setWaitingList] = useState([]);
  const [organizedWaitingList, setOrganizedWaitingList] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    barber: 'Any',
  });
  const [isTablet, setIsTablet] = useState(false);

  const router = useRouter();

  const changeHandler = (e) => {
    const property = e.target.name;
    setFormData({ ...formData, [property]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { name, barber } = formData;

    const res = await fetch(`${NEXT_URL}/api/walk-ins/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        barber,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      const getWalkIns = await fetch(`${NEXT_URL}/api/walk-ins/get-walk-ins`);
      const data = await getWalkIns.json();

      if (getWalkIns.ok) {
        setWalkIns(data.data);
        setSuccessMsg('Success!!');
      } else {
        setError(data.message);
      }
    } else {
      setError(data.message);
    }
  };

  const handleDelete = async (client) => {
    const { id } = client;
    if (confirm('Are you sure you want to delete this entry?')) {
      //Check to see if we are deleting an appointment or walk-in
      if (client?.attributes?.appointment) {
        const res = await fetch(`${NEXT_URL}/api/appt/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          const getAppts = await fetch(`${NEXT_URL}/api/appt/get-appts`);
          const data = await getAppts.json();

          if (getAppts.ok) {
            setAppointments(data.data);
          } else {
            setError(data.message);
          }
        } else {
          setError(data.message);
        }
      } else {
        const res = await fetch(`${NEXT_URL}/api/walk-ins/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          const getWalkIns = await fetch(
            `${NEXT_URL}/api/walk-ins/get-walk-ins`
          );
          const data = await getWalkIns.json();

          if (getWalkIns.ok) {
            setWalkIns(data.data);
          } else {
            setError(data.message);
          }
        } else {
          setError(data.message);
        }
      }
    }
  };

  function formatTimeUTC(isoString) {
    const date = new Date(isoString);

    // Extract hours and minutes in UTC
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to always be two digits
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Construct the formatted time string
    return hours + ':' + formattedMinutes + ' ' + ampm;
  }

  function combineDateAndTime(appt) {
    const dateStr = appt.attributes.date;
    const timeStr = appt.attributes.time;
    const name = appt.attributes.name;
    const barber = appt.attributes.barbers.data[0].attributes.name;
    // Parse the date and time strings
    const dateParts = dateStr.split('-').map((part) => parseInt(part, 10));
    const timeParts = timeStr.split(':').map((part) => parseInt(part, 10));

    // Create a Date object (Note: Months are 0-indexed in JavaScript Date)
    const dateTime = new Date(
      Date.UTC(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2],
        timeParts[0],
        timeParts[1],
        timeParts[2]
      )
    );

    // Convert to ISO 8601 string in UTC = dateTime.toISOString();

    return {
      attributes: {
        name,
        appointment: dateTime.toISOString(),
        barber,
      },
      id: appt.id,
    };
  }

  function isDateToday(dateStr) {
    const today = new Date();
    const inputDate = new Date(dateStr + 'T00:00:00Z'); // Assuming the dateStr is in UTC

    // Convert both dates to UTC
    const todayUTC = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const inputDateUTC = inputDate.getTime();

    return todayUTC === inputDateUTC;
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      router.push('/');
    }
  };

  useEffect(() => {
    const apptIsToday = appointments.filter((appt) => {
      return isDateToday(appt.attributes.date);
    });
    const apptsFormatted = apptIsToday.map((appt) => {
      return combineDateAndTime(appt);
    });
    setWaitingList([...walkIns, ...apptsFormatted]);
  }, [walkIns, appointments]);

  useEffect(() => {
    setOrganizedWaitingList(() => {
      return waitingList.sort((a, b) => {
        let dateA;
        let dateB;
        // Convert date strings to Date objects for comparison
        if (a?.attributes?.createdAt) {
          dateA = new Date(a.attributes.createdAt).getTime() - 21600000;
        } else {
          dateA = new Date(a.attributes.appointment).getTime();
        }
        if (b?.attributes?.createdAt) {
          dateB = new Date(b.attributes.createdAt).getTime() - 21600000;
        } else {
          dateB = new Date(b.attributes.appointment).getTime();
        }

        // Compare the dates
        return dateA - dateB;
      });
    });
  }, [waitingList]);

  useEffect(() => {
    setIsTablet(window.innerWidth >= 650 && window.innerWidth <= 1024);
  }, []);

  return (
    <Layout title="El Elyon | Dashboard">
      <div className={classes.bg}>
        <div className={classes.container}>
          <div className={classes['form-container']}>
            <form onSubmit={submitHandler} className={classes.form}>
              <h2 className={classes.title}>Sign In</h2>
              <p className={classes.label}>Name:</p>
              <input
                type="text"
                name="name"
                className={classes.input}
                onChange={changeHandler}
                value={formData.name}
              />
              <div className={classes['selection-container']}>
                <p className={classes.label}>Select a barber:</p>

                <select
                  id="barberSelect"
                  name="barber"
                  className={classes['barber-select']}
                  onChange={(e) => changeHandler(e)}
                  value={formData.barber}
                >
                  {barbers.data.map((barber, index) => {
                    return (
                      <option value={barber.attributes.name} key={index}>
                        {barber.attributes.name}
                      </option>
                    );
                  })}
                </select>
                <BsChevronDown className={classes.icon} />
              </div>
              <div className={classes['btn-container']}>
                <button className={`${classes.btn}`}>Sign In</button>
                <button
                  type="button"
                  className={`${classes.btn}`}
                  onClick={handleLogout}
                >
                  Logout
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
          <div className={classes['list-container']}>
            <h2 className={classes.title}>Waiting List</h2>
            <table className={classes.table}>
              <thead className={classes['table-head']}>
                <tr className={classes['table-row']}>
                  <th className={classes['table-heading']}>Position</th>
                  <th className={classes['table-heading']}>Name</th>
                  <th className={classes['table-heading']}>Barber</th>
                  <th className={classes['table-heading']}>Appointment</th>
                  <th className={classes['table-heading']}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizedWaitingList?.map((client, index) => {
                  const { name } = client.attributes;
                  const barber =
                    client?.attributes?.barber?.data?.attributes?.name ||
                    client.attributes.barber;
                  return (
                    <tr key={index}>
                      <td className={classes.cell}>{index + 1}.</td>
                      <td className={classes.cell}>{name}</td>
                      <td className={classes.cell}>{barber}</td>
                      <td className={classes.cell}>
                        {client?.attributes?.appointment
                          ? formatTimeUTC(client.attributes.appointment)
                          : 'N/A'}
                      </td>
                      <td className={classes.cell}>
                        <IoMdClose
                          size={20}
                          className={classes['delete-icon']}
                          onClick={() => handleDelete(client)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default AdminDashboardPage;

export async function getServerSideProps(context) {
  const { req } = context;
  const browserCookie = req.headers.cookie;

  if (!browserCookie) {
    return {
      redirect: {
        destination: '/account/admin/login',
        permanent: false,
      },
    };
  }

  const { token } = cookie.parse(browserCookie);

  if (!token) {
    return {
      redirect: {
        destination: '/account/admin/login',
        permanent: false,
      },
    };
  }

  const getUser = await fetch(`${API_URL}/api/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const user = await getUser.json();

  if (user.username !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const getBarbers = await fetch(`${API_URL}/api/barbers?populate=*`);
  const barbers = await getBarbers.json();

  const getAppointments = await fetch(`${API_URL}/api/appointments?populate=*`);
  const allAppointments = await getAppointments.json();

  const getWalkIns = await fetch(`${API_URL}/api/walk-ins?populate=*`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const allWalkIns = await getWalkIns.json();

  return {
    props: { barbers, allAppointments, allWalkIns },
  };
}
