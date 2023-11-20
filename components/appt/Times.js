import classes from '@/styles/Times.module.css';
import AuthContext from '@/utils/AuthContext';
import { useContext, useEffect } from 'react';

const Times = ({ setActiveStep, barbers }) => {
  const { setApptInfo, apptInfo } = useContext(AuthContext);

  let hoursArray = [];
  let skipIterations = 0;

  //For loop which adds all time blocks to hoursArray.
  for (let i = 10; i <= 18; i++) {
    for (let j = 0; j < 60; j += 15) {
      let hourFormat12 = i > 12 ? i - 12 : i; // Convert to 12-hour format
      let period = i >= 12 ? 'PM' : 'AM';
      let hour = hourFormat12 < 10 ? '0' + hourFormat12 : hourFormat12;
      let minute = j < 10 ? '0' + j : j;
      hoursArray.push(`${hour}:${minute} ${period}`);
    }
  }

  // To remove 6:15 PM, 6:30 PM, and 6:45 PM as they're after 6 pm
  hoursArray = hoursArray.slice(0, -3);

  const handleSelection = (e) => {
    setApptInfo({
      ...apptInfo,
      time: e.currentTarget.getAttribute('data-time'),
    });
    setActiveStep(5);
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

  function convertToDateTime(timeString, isEndTime, isApptTime) {
    // Extract hours, minutes, and period from the time string
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':');

    // Convert hours to 24-hour format
    hours = parseInt(hours, 10);
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    // Create a date object with the time
    const dateTime = new Date();
    if (!isEndTime && !isApptTime) {
      dateTime.setHours(hours, parseInt(minutes, 10), 0, 0);
    } else if (isEndTime) {
      dateTime.setHours(hours, parseInt(minutes, 10) - 30, 0, 0);
    } else {
      dateTime.setHours(hours, parseInt(minutes, 10) - 45, 0, 0);
    }

    return dateTime;
  }

  function isTimeEarlier(scheduleStartTime, scheduleEndTime, time) {
    // Function to convert time string to a date object

    // Convert all times to date objects
    const scheduleStartDateTime = convertToDateTime(
      scheduleStartTime,
      false,
      false
    );
    const scheduleEndDateTime = convertToDateTime(scheduleEndTime, true, false);
    const timeDateTime = convertToDateTime(time, false, false);

    // Compare the two times
    if (
      timeDateTime < scheduleStartDateTime ||
      timeDateTime >= scheduleEndDateTime
    ) {
      return true;
    }

    return false;
  }

  const checkAvailability = (time) => {
    //Get the selected barber
    const selectedBarber = barbers.data.filter((barber) => {
      return barber.attributes.name === apptInfo.barber;
    })[0];

    //Get all appointments for current day
    const apptsForCurrentDay =
      selectedBarber.attributes.appointments.data.filter((appt) => {
        return appt.attributes.date === apptInfo.date;
      });
    //Extract the time from each appt
    const timesForAppts = apptsForCurrentDay.map((appt) => {
      return formatTimeString(appt.attributes.time);
    });
    //Get the corresponding schedule for selected day
    const matchingScheduleDay = selectedBarber.attributes.schedules.data.filter(
      (schedule) => {
        return schedule.attributes.date === apptInfo.date;
      }
    );

    //Extract clock in and out hours
    const scheduleStartTime = matchingScheduleDay[0].attributes.startTime;
    const scheduleEndTime = matchingScheduleDay[0].attributes.endTime;

    if (timesForAppts.length > 0) {
      timesForAppts.forEach((apptTime) => {
        //Convert appt time - 45 min and current time iteration to compare and see if they are equal
        const apptTimeFormatted = convertToDateTime(apptTime, false, true);
        const currentTimeFormatted = convertToDateTime(time, false, false);

        if (apptTimeFormatted.getTime() === currentTimeFormatted.getTime()) {
          //If they are equal, next 6 time blocks will be unavailable
          skipIterations = 6;
        }
      });
    }

    if (
      isTimeEarlier(scheduleStartTime, scheduleEndTime, time) ||
      timesForAppts.includes(time)
    ) {
      skipIterations = 3;
      return false;
    }
    return true;
  };

  return (
    <ul className={classes['times-container']}>
      {hoursArray.map((time, index) => {
        if (skipIterations > 0) {
          skipIterations--;
          return (
            <li className={`${classes['na']}`} key={index}>
              {time}
            </li>
          );
        }
        if (apptInfo.barber === 'Any') {
          return (
            <li
              className={classes.time}
              data-time={time}
              onClick={handleSelection}
              key={index}
            >
              {time}
            </li>
          );
        } else {
          const isAvailable = checkAvailability(time);
          if (!isAvailable) {
            return (
              <li className={`${classes['na']}`} key={index}>
                {time}
              </li>
            );
          } else {
            return (
              <li
                className={classes.time}
                data-time={time}
                onClick={handleSelection}
                key={index}
              >
                {time}
              </li>
            );
          }
        }
      })}
    </ul>
  );
};
export default Times;
