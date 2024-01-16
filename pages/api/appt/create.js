import { API_URL } from '@/config/index';
import cookie from 'cookie';
import { containsSpecialCharacters } from '@/utils/specialCharacterCheck';
import sendGrid from '@sendgrid/mail';
import twilio from 'twilio';

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async (req, res) => {
  if (req.method === 'POST') {
    const { service, barber, date, time } = req.body;
    const { token } = cookie.parse(req.headers.cookie);

    function isEarlierThanNow(date, time) {
      // Combine date and time into a single string
      const dateTimeStr = date + 'T' + time;

      // Create a Date object from the combined string
      const dateTime = new Date(dateTimeStr);

      // Get the current date and time
      const now = new Date();

      // Compare and return the result
      return dateTime < now;
    }

    if (isEarlierThanNow(date, convertTime12to24(time))) {
      res.status(400).json({ message: 'Appointment must be in the future.' });
      return;
    }

    function checkServiceInput(inputString) {
      const specialCharacters = ['<', '>', '[', ']', '{', '}', '"'];

      for (let i = 0; i < inputString.length; i++) {
        if (specialCharacters.includes(inputString[i])) {
          return true;
        }
      }

      return false;
    }

    if (!token) {
      res
        .status(403)
        .json({ message: 'Only registered users can make appointments.' });
      return;
    }
    if (
      containsSpecialCharacters(barber) ||
      containsSpecialCharacters(date) ||
      containsSpecialCharacters(time)
    ) {
      res.status(400).json({
        message:
          'Cannot use the following characters: <, >, [, ], {, }, &, \', "',
      });
      return;
    }
    if (checkServiceInput(service)) {
      res.status(400).json({
        message: 'Cannot use the following characters: <, >, [, ], {, }, "',
      });
      return;
    }
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
      return `${hours.toString().padStart(2, '0')}:${minutes}:00.000`;
    }

    const formattedDate = convertDateFormat(date);

    const getBarbers = await fetch(`${API_URL}/api/barbers?populate=*`);
    const allBarbers = await getBarbers.json();

    const selectedBarber = allBarbers.data.filter((b) => {
      return b.attributes.name === barber;
    });

    if (!getBarbers.ok) {
      res.status(400).json({
        message: 'Something went wrong. Please try again.',
      });
      return;
    }

    if (selectedBarber.length === 0) {
      res.status(400).json({
        message: 'Invalid barber input.',
      });
      return;
    }

    const getSelectedService = await fetch(
      `${API_URL}/api/services?filters[name][$eq]=${encodeURIComponent(
        service
      )}`
    );
    const selectedService = await getSelectedService.json();

    if (!getSelectedService.ok) {
      res.status(400).json({
        message: 'Something went wrong.',
      });
      return;
    }
    if (selectedService.data.length === 0) {
      res.status(400).json({
        message: 'Invalid service provided.',
      });
      return;
    }

    const getAppointments = await fetch(
      `${API_URL}/api/appointments?populate=*`
    );
    const appointmentsThatDay = await getAppointments.json();

    if (!getAppointments.ok) {
      res.status(400).json({
        message: 'Something went wrong. Please try again.',
      });
      return;
    }

    const getUser = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = await getUser.json();

    if (!getUser.ok) {
      res.status(400).json({
        message: 'Something went wrong.',
      });
      return;
    }

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
      return `${adjustedHours
        .toString()
        .padStart(2, '0')}:${minutes} ${amOrPm}`;
    }

    function tallyAppointments(appointments) {
      const tally = {};

      appointments.data.forEach((appt) => {
        const time = appt.attributes.time; // Assuming 'time' is the property that holds the appointment time
        if (tally[time]) {
          tally[time] += 1;
        } else {
          tally[time] = 1;
        }
      });

      // Convert the tally object to an array of objects
      const result = Object.keys(tally).map((time) => {
        return { time: time, instances: tally[time] };
      });

      return result;
    }

    function isTimeAtLeast30MinApart(userTime, timesArray) {
      // Helper function to convert time string to Date object
      const convertTimeToDate = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');

        // Convert hours to 24-hour format
        hours = parseInt(hours, 10);
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }

        // Create a new date object with the time
        const date = new Date();
        date.setHours(hours, parseInt(minutes, 10), 0, 0);
        return date;
      };

      // Convert userTime and times in array to Date objects
      const userDateTime = convertTimeToDate(userTime);

      // Check if user time is at least 30 minutes apart from each time in the array
      return timesArray.every((timeStr) => {
        const timeDate = convertTimeToDate(formatTimeString(timeStr.time));
        const diff = Math.abs(userDateTime - timeDate);
        return diff > 30 * 60 * 1000; // 30 minutes in milliseconds
      });
    }

    let apptConflict = false;
    let isSomeoneWorking = true;

    function doBarbersEqualAppts() {
      // Filter out the "Any" barber and then map
      const barbersWorkingThatDay = allBarbers.data
        .filter((barber) => barber.attributes.name !== 'Any')
        .map((barber) => {
          const barbersSchedule = barber.attributes.schedules.data.filter(
            (schedule) => schedule.attributes.date === date
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

      // Filter barbers working during the selected time
      const barbersWorkingDuringSelectedTime = barbersWorkingThatDay.filter(
        (barber) => {
          const { startTime, endTime } = barber.schedule.attributes;
          return isTimeWithinShift(startTime, endTime, time);
        }
      );

      // Check if no barbers are working that day
      isSomeoneWorking =
        barbersWorkingThatDay.length > 0 &&
        barbersWorkingDuringSelectedTime.length > 0;

      const apptInstances = tallyAppointments(appointmentsThatDay);

      const invalidTimes = apptInstances.filter((appt) => {
        return appt.instances === barbersWorkingDuringSelectedTime.length;
      });

      // Check for appointment conflicts
      apptConflict = !isTimeAtLeast30MinApart(time, invalidTimes);
    }

    if (selectedBarber[0].attributes.name === 'Any') {
      doBarbersEqualAppts();
    }

    if (!isSomeoneWorking) {
      res.status(400).json({
        message: 'Please choose another date or time.',
      });
      return;
    }

    if (selectedBarber[0].attributes.name !== 'Any') {
      doBarbersEqualAppts();
      const selectedDateSchedule =
        selectedBarber[0].attributes.schedules.data.filter((schedule) => {
          return schedule.attributes.date === date;
        });
      if (selectedDateSchedule.length === 0) {
        res.status(400).json({
          message: 'Date is not valid.',
        });
        return;
      }

      const shiftStart = selectedDateSchedule[0].attributes.startTime;
      const shiftEnd = selectedDateSchedule[0].attributes.endTime;

      if (!isTimeWithinShift(shiftStart, shiftEnd, time)) {
        res.status(400).json({
          message: 'Time is not valid.',
        });
        return;
      }
      const selectedDateAppts =
        selectedBarber[0].attributes.appointments.data.filter((appt) => {
          return appt.attributes.date === date;
        });

      selectedDateAppts.forEach((appt) => {
        if (isTimeOutsideApptWindow(appt.attributes.time, time)) {
          apptConflict = true;
        }
      });
    }

    if (apptConflict) {
      res.status(400).json({
        message: 'Time conflicts with existing appointment(s).',
      });
      return;
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

      // Subtract 45 minutes from shiftEnd
      end = new Date(end.getTime() - 45 * 60000);

      const currentTime = parseTime(time, true);

      // Check if currentTime is between start and 45 min before end
      return currentTime >= start && currentTime <= end;
    }

    function isTimeOutsideApptWindow(apptTime, time) {
      // Helper function to parse time strings
      const parseTime = (timeStr, is12HourFormat = false) => {
        const [timePart, modifier] = is12HourFormat
          ? timeStr.split(' ')
          : [timeStr];
        let [hours, minutes] = timePart.split(':');

        if (is12HourFormat) {
          hours = (parseInt(hours, 10) % 12) + (modifier === 'PM' ? 12 : 0);
        }

        const date = new Date();
        date.setHours(hours, minutes, 0, 0); // Resetting seconds and milliseconds
        return date;
      };

      // Convert apptTime and time to Date objects
      const apptDateTime = parseTime(apptTime);
      const currentTime = parseTime(time, true);

      // Calculate 45 minutes before and 1 hour after apptTime
      const thirtyMinBefore = new Date(apptDateTime.getTime() - 30 * 60000);
      const thirtyMinAfter = new Date(apptDateTime.getTime() + 30 * 60000);

      // Check if currentTime is within the specified window
      return currentTime >= thirtyMinBefore && currentTime <= thirtyMinAfter;
    }

    const strapiRes = await fetch(`${API_URL}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          service: selectedService.data[0].id,
          date,
          time: convertTime12to24(time),
          barbers: selectedBarber[0].id,
          name: `${user.firstName} ${user.lastName}`,
        },
      }),
    });

    const data = await strapiRes.json();

    if (strapiRes.ok) {
      if (user.reminderType === 'both' || user.reminderType === 'email') {
        let draftEmail = {
          from: {
            email: 'elelyonbusiness7@gmail.com',
            name: 'El Elyon',
          },
          personalizations: [
            {
              to: [
                {
                  email: user.email,
                },
              ],
              dynamic_template_data: {
                date: convertDateFormat(date),
                service,
                time,
                barber,
                price: `$${selectedService.data[0].attributes.price.toFixed(
                  2
                )}`,
              },
            },
          ],
          template_id: 'd-644eba02fa144586a9becb7461179334',
        };
        await sendGrid
          .send(draftEmail)
          .then(() => console.log('Mail sent successfully'))
          .catch((error) => {
            res
              .status(400)
              .json({ message: 'Something went wrong. Email did not send.' });
          });
      }
      if (user.reminderType === 'both' || user.reminderType === 'text') {
        await client.messages
          .create({
            body: `Hi ${user.firstName}, you have an upcoming appointment with ${selectedBarber[0].attributes.name} on ${formattedDate} at ${time} for a ${selectedService.data[0].attributes.name}. If you have any questions, please call 713-560-5371.`,
            from: '+18556204478',
            to: `+1-512-560-0090`,
          })
          .then((message) => console.log('Text sent successfully'))
          .catch((error) => {
            res
              .status(400)
              .json({ message: 'Something went wrong. Text did not send.' });
          });
      }
      res.status(200).json({ data });
    } else {
      res.status(data.error.status).json({ message: 'Something went wrong.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
