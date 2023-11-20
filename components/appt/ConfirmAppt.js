import AuthContext from '@/utils/AuthContext';
import classes from '@/styles/ConfirmAppt.module.css';
import { useContext } from 'react';
import { NEXT_URL } from '@/config/index';
import { useRouter } from 'next/router';

const ConfirmAppt = ({ setActiveStep, setComponentError }) => {
  const { setApptInfo, apptInfo, user } = useContext(AuthContext);
  const { service, barber, date, time, price } = apptInfo;
  const priceToNum = +price;

  const router = useRouter();

  const handleConfirm = async () => {
    const { service, barber, date, time } = apptInfo;
    const res = await fetch(`${NEXT_URL}/api/appt/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        service,
        barber,
        date,
        time,
        price: priceToNum,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      router.reload();
    } else {
      console.log(data);
    }
  };
  const handleCancel = () => {
    setApptInfo({
      service: '',
      barber: '',
      date: '',
      time: '',
      price: '',
    });
    setActiveStep(0);
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
  return (
    <>
      <table className={classes['appt-container']}>
        <thead>
          <tr className={classes.row}>
            <th className={classes.header}>Service</th>
            <th className={classes.header}>Time</th>
            <th className={classes.header}>Barber</th>
            <th className={classes.header}>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.row}>
            <td className={classes.cell}>{service}</td>
            <td className={classes.cell}>
              {convertDateFormat(date)} - {time}
            </td>
            <td className={classes.cell}>{barber}</td>
            <td className={classes.cell}>${priceToNum.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div className={classes['btns-container']}>
        <button className={classes['confirm-btn']} onClick={handleConfirm}>
          Confirm
        </button>
        <button className={classes['cancel-btn']} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </>
  );
};
export default ConfirmAppt;
