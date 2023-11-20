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
    const { service, barber, date, time, price, user } = req.body;
    const { token } = cookie.parse(req.headers.cookie);

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
        .json({ message: 'Only registered users can make appointments' });
    }
    if (
      containsSpecialCharacters(barber) ||
      containsSpecialCharacters(date) ||
      containsSpecialCharacters(time) ||
      containsSpecialCharacters(price) ||
      containsSpecialCharacters(user.email)
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

    const getBarbers = await fetch(`${API_URL}/api/barbers`);
    const barbers = await getBarbers.json();

    const selectedBarber = barbers.data.filter((b) => {
      return b.attributes.name === barber;
    });

    const strapiRes = await fetch(`${API_URL}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          service,
          date,
          time: convertTime12to24(time),
          barber: selectedBarber[0].id,
        },
      }),
    });

    const data = await strapiRes.json();

    if (strapiRes.ok) {
      let draftEmail = {
        from: {
          email: 'support@annyabby.com',
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
              price: `$${price.toFixed(2)}`,
            },
          },
        ],
        template_id: 'd-644eba02fa144586a9becb7461179334',
      };
      await sendGrid
        .send(draftEmail)
        .then(() => console.log('Mail sent successfully'))
        .catch((error) => {
          console.log(error);
        });
      await client.messages
        .create({
          body: 'This is a test',
          from: '+18556204478',
          to: `+15125600090`,
        })
        .then((message) => console.log('Text sent successfully'))
        .catch((error) => {
          console.log(error);
        });
      res.status(200).json({ data });
    } else {
      res.status(data.error.status).json({ message: data.error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
