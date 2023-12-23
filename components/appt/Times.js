import classes from '@/styles/Times.module.css';
import AuthContext from '@/utils/AuthContext';
import { useContext, useEffect, useState } from 'react';

const Times = ({ setActiveStep, barbers, appts }) => {
  const { setApptInfo, apptInfo } = useContext(AuthContext);
  const [availability, setAvailability] = useState([]);
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');

  let hoursArray = [];

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
      dateTime.setHours(hours, parseInt(minutes, 10), 0, 0);
    } else {
      dateTime.setHours(hours, parseInt(minutes, 10), 0, 0);
    }

    return dateTime;
  }

  const checkBarberAvailability = (time) => {
    let barberIsNotAvailable = false;
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

    //Extract clock in and out hours

    if (timesForAppts.length > 0) {
      timesForAppts.forEach((apptTime) => {
        //Convert appt time - 45 min and current time iteration to compare and see if they are equal
        const apptTimeFormatted = convertToDateTime(apptTime, false, true);
        const currentTimeFormatted = convertToDateTime(time, false, false);

        if (apptTimeFormatted.getTime() === currentTimeFormatted.getTime()) {
          //If they are equal, next 6 time blocks will be unavailable
          barberIsNotAvailable = true;
        }
      });
    }
    return barberIsNotAvailable;
  };

  function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    // Convert hour from 12-hour to 24-hour format
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    // Return the formatted time
    return process.env.NEXT_PUBLIC_PRODUCTION === 'false'
      ? `${hours.toString().padStart(2, '0')}:${minutes}:00.000`
      : `${hours.toString().padStart(2, '0')}:${minutes}:00`;
  }

  function isTimeWithinShift(shiftStart, shiftEnd, time) {
    // Helper function to convert time string to Date object
    const parseTime = (timeStr, is12HourFormat = false) => {
      const [timePart, modifier] = timeStr.split(' ');
      let [hours, minutes] = timePart.split(':');

      if (is12HourFormat) {
        hours = (parseInt(hours, 10) % 12) + (modifier === 'PM' ? 12 : 0);
      }

      const date = new Date();
      date.setHours(hours, minutes, 0, 0); // Resetting seconds and milliseconds
      return date;
    };

    const start = parseTime(shiftStart);
    let end = parseTime(shiftEnd);

    end = new Date(end.getTime());

    const currentTime = parseTime(time, true);

    // Check if currentTime is between start and 45 min before end
    return currentTime >= start && currentTime <= end;
  }

  const checkAllBarbersAvailability = (time) => {
    // Filter out the "Any" barber and then map
    const barbersWorkingThatDay = barbers.data
      .filter((barber) => barber.attributes.name !== 'Any')
      .map((barber) => {
        const barbersSchedule = barber.attributes.schedules.data.filter(
          (schedule) => schedule.attributes.date === apptInfo.date
        );

        // Check if there's a schedule and return the required object
        if (barbersSchedule.length > 0) {
          return {
            name: barber.attributes.name,
            schedule: barbersSchedule[0], // Assuming you want the first schedule
          };
        }
        return null;
      })
      .filter((item) => item !== null); // Filter out null values

    const appointmentsAtThisTime = appts.data.filter((appt) => {
      return (
        appt.attributes.date === apptInfo.date &&
        appt.attributes.time === convertTime12to24(time)
      );
    });

    // Filter barbers working during the selected time
    const barbersWorkingAtThisTime = barbersWorkingThatDay.filter((barber) => {
      const { startTime, endTime } = barber.schedule.attributes;
      return isTimeWithinShift(startTime, endTime, time);
    });

    if (
      barbersWorkingAtThisTime.length <= appointmentsAtThisTime.length &&
      appointmentsAtThisTime.length !== 0
    ) {
      return true;
    }
    return false;
  };

  function isEarlierThanNow(date, time) {
    // Combine date and time into a single string
    const dateTimeStr = date + 'T' + time;

    // Create a Date object from the combined string
    const dateTime = new Date(dateTimeStr);

    // Get the current date and time
    const now = new Date();

    // Compare and return the result
    if (dateTime < now) {
      return true;
    }
    return false;
  }

  function changeTimeByMinutes(timeStr, minutes) {
    const [hours, minutesPart] = timeStr.split(':');
    const [mins, period] = minutesPart.split(' ');

    let time = new Date();
    time.setHours(
      (hours % 12) + (period === 'PM' ? 12 : 0),
      parseInt(mins, 10) + minutes,
      0,
      0
    );

    const adjustedHours = time.getHours();
    const adjustedMinutes = time.getMinutes();
    const newPeriod = adjustedHours >= 12 ? 'PM' : 'AM';
    const formattedHours = (adjustedHours % 12 === 0 ? 12 : adjustedHours % 12)
      .toString()
      .padStart(2, '0');
    const formattedMinutes = adjustedMinutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${newPeriod}`;
  }

  useEffect(() => {
    let updatedAvailability = hoursArray.reduce(
      (acc, time) => ({ ...acc, [time]: true }),
      {}
    );

    hoursArray.forEach((time) => {
      if (isEarlierThanNow(apptInfo.date, convertTime12to24(time))) {
        updatedAvailability[time] = false;
      }
      if (apptInfo.barber === 'Any') {
        if (checkAllBarbersAvailability(time)) {
          updatedAvailability[time] = false;

          // Mark the adjacent two time blocks as unavailable
          const timeBefore1 = changeTimeByMinutes(time, -15);
          const timeBefore2 = changeTimeByMinutes(time, -30);
          const timeAfter1 = changeTimeByMinutes(time, 15);
          const timeAfter2 = changeTimeByMinutes(time, 30);

          [timeBefore1, timeBefore2, timeAfter1, timeAfter2].forEach(
            (adjacentTime) => {
              if (updatedAvailability.hasOwnProperty(adjacentTime)) {
                updatedAvailability[adjacentTime] = false;
              }
            }
          );
        }
        // Get the keys of the object (the time slots)
        const timeSlots = Object.keys(updatedAvailability);

        // Get the last three time slots
        const lastThreeSlots = timeSlots.slice(-3);

        // Set the value of the last three time slots to false
        lastThreeSlots.forEach((timeSlot) => {
          updatedAvailability[timeSlot] = false;
        });
      }

      if (apptInfo.barber !== 'Any') {
        if (
          !isTimeWithinShift(
            shiftStart,
            convertTime12to24(
              changeTimeByMinutes(formatTimeString(shiftEnd), -45)
            ),
            time
          )
        ) {
          updatedAvailability[time] = false;
        }
        if (
          checkAllBarbersAvailability(time) ||
          checkBarberAvailability(time)
        ) {
          updatedAvailability[time] = false;

          // Mark the adjacent two time blocks as unavailable
          const timeBefore1 = changeTimeByMinutes(time, -15);
          const timeBefore2 = changeTimeByMinutes(time, -30);
          const timeAfter1 = changeTimeByMinutes(time, 15);
          const timeAfter2 = changeTimeByMinutes(time, 30);

          [timeBefore1, timeBefore2, timeAfter1, timeAfter2].forEach(
            (adjacentTime) => {
              if (updatedAvailability.hasOwnProperty(adjacentTime)) {
                updatedAvailability[adjacentTime] = false;
              }
            }
          );
        }
      }
    });

    setAvailability(updatedAvailability);
  }, [barbers, appts, apptInfo.date, apptInfo.barber, shiftStart, shiftEnd]);

  useEffect(() => {
    const selectedBarber = barbers.data.filter((barber) => {
      return barber.attributes.name === apptInfo.barber;
    })[0];
    const matchingScheduleDay = selectedBarber.attributes.schedules.data.filter(
      (schedule) => {
        return schedule.attributes.date === apptInfo.date;
      }
    );
    setShiftStart(matchingScheduleDay[0].attributes.startTime);
    setShiftEnd(matchingScheduleDay[0].attributes.endTime);
  }, []);

  return (
    <ul className={classes['times-container']}>
      {hoursArray.map((time, index) => {
        const isUnavailable = !availability[time];
        const timeClass = isUnavailable ? `${classes['na']}` : classes.time;
        const handleClick = isUnavailable
          ? undefined
          : (e) => handleSelection(e);

        return (
          <li
            className={timeClass}
            data-time={time}
            onClick={handleClick}
            key={index}
          >
            {time}
          </li>
        );
      })}
    </ul>
  );
};

export default Times;
