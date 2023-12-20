import { useContext, useEffect, useState } from 'react';
import classes from '@/styles/Calendar.module.css';
import AuthContext from '@/utils/AuthContext';

export default function Calendar({ setActiveStep, barbers, schedules }) {
  const { setApptInfo, apptInfo } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());

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

  function isLeapYear(year) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return true;
    }
    return false;
  }

  const daysInMonth = [
    31,
    isLeapYear(date.getFullYear()) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month).getDay(); // Gets day of the month (e.g. Monday, Tuesday, Wednesday...)
  }

  function prevMonth() {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  }

  function nextMonth() {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  }
  function isPast(date) {
    const now = new Date(); // Current date and time
    now.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    return date < now; // If the given date is before the current date, return true
  }
  const handleSelection = (e) => {
    setApptInfo({
      ...apptInfo,
      date: `${e.currentTarget.getAttribute(
        'data-year'
      )}-${e.currentTarget.getAttribute('data-month')}-${e.currentTarget
        .getAttribute('data-date')
        .padStart(2, '0')}`,
    });
    setActiveStep(4);
  };

  const checkSchedule = (barber, i) => {
    // Gets the schedule for the selected barber
    const schedules = barbers.data.filter((b) => {
      return barber === b.attributes.name;
    })[0].attributes.schedules;
    //Extracts the dates from the barbers schedule
    const dates = schedules.data.map((schedule) => {
      return schedule.attributes.date;
    });
    // Convert currentDate object to a string in 'YYYY-MM-DD' format
    const currentDateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    //Checks to see if currentDateString matches any values in dates array
    return dates.includes(currentDateString);
  };

  //Pads the week with the days from the previous month if applicable
  const firstDay = getFirstDayOfMonth(date.getFullYear(), date.getMonth());
  let days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<td className={classes.cell} key={`prev-${i}`} />);
  }

  //Adds the days for the current month
  for (let i = 1; i <= daysInMonth[date.getMonth()]; i++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
    const dateIsPast = isPast(currentDate);
    if (apptInfo.barber === 'Any') {
      const dayIsAvailable = checkSchedule(apptInfo.barber, i);
      if (dateIsPast || !dayIsAvailable) {
        days.push(
          <td key={i} className={`${classes.cell}`}>
            {i}
          </td>
        );
      } else {
        days.push(
          <td
            key={i}
            className={`${classes.cell} ${classes['not-empty']}`}
            onClick={handleSelection}
            data-date={i}
            data-month={date.getMonth() + 1}
            data-year={date.getFullYear()}
          >
            {i}
          </td>
        );
      }
    } else {
      const barberIsWorking = checkSchedule(apptInfo.barber, i);
      if (dateIsPast || !barberIsWorking) {
        days.push(
          <td key={i} className={`${classes.cell}`}>
            {i}
          </td>
        );
      } else {
        days.push(
          <td
            key={i}
            className={`${classes.cell} ${classes['not-empty']}`}
            onClick={handleSelection}
            data-date={i}
            data-month={date.getMonth() + 1}
            data-year={date.getFullYear()}
          >
            {i}
          </td>
        );
      }
    }
  }

  //Pads the remainder of the week with next month's days if applicable
  while (days.length % 7 !== 0) {
    days.push(<td className={classes.cell} key={`next-${days.length}`} />);
  }

  const rows = [];
  for (let i = 0; i < days.length / 7; i++) {
    rows.push(<tr key={i}>{days.slice(i * 7, (i + 1) * 7)}</tr>);
  }

  return (
    <div>
      <div className={classes.header}>
        <button onClick={prevMonth} className={classes['prev-btn']}>
          <span className={classes['prev-btn-text']}>&lt;</span>
        </button>
        <span className={classes['month-heading']}>
          {monthNames[date.getMonth()]} {date.getFullYear()}
        </span>
        <button onClick={nextMonth} className={classes['next-btn']}>
          <span className={classes['next-btn-text']}>&gt;</span>
        </button>
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes['day-header']}>SUN</th>
            <th className={classes['day-header']}>MON</th>
            <th className={classes['day-header']}>TUE</th>
            <th className={classes['day-header']}>WED</th>
            <th className={classes['day-header']}>THU</th>
            <th className={classes['day-header']}>FRI</th>
            <th className={classes['day-header']}>SAT</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <style jsx>{`
        td,
        th {
          text-align: center;
          padding: 10px;
        }
        .highlighted {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
}
