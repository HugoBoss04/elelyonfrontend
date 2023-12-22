import { API_URL } from '@/config/index';
import cookie from 'cookie';
import { containsSpecialCharacters } from '@/utils/specialCharacterCheck';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, barber } = req.body;
    const { token } = cookie.parse(req.headers.cookie);

    function checkBarberInput(inputString) {
      const specialCharacters = ['<', '>', '[', ']', '{', '}', '"'];

      for (let i = 0; i < inputString.length; i++) {
        if (specialCharacters.includes(inputString[i])) {
          return true;
        }
      }

      return false;
    }

    if (!token) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    if (containsSpecialCharacters(name)) {
      res.status(400).json({
        message:
          'Name cannot contain the following characters: <, >, [, ], {, }, &, \', "',
      });
      return;
    }
    if (checkBarberInput(barber)) {
      res.status(400).json({
        message:
          'Barber cannot contain the following characters: <, >, [, ], {, }, "',
      });
      return;
    }

    const getBarbers = await fetch(`${API_URL}/api/barbers?populate=*`);
    const allBarbers = await getBarbers.json();
    const matchingBarber = allBarbers.data.filter((b) => {
      return b.attributes.name === barber;
    });

    const strapiRes = await fetch(`${API_URL}/api/walk-ins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          name,
          barber: matchingBarber[0].id,
        },
      }),
    });

    const data = await strapiRes.json();

    if (strapiRes.ok) {
      res.status(200).json({ data });
    } else {
      res.status(data.error.status).json({ message: data.error.message });
      return;
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
