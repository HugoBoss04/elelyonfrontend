import { API_URL } from '@/config/index';
import { containsSpecialCharacters } from 'utils/specialCharacterCheck';
import validator from 'validator';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (containsSpecialCharacters(email)) {
      res.status(400).json({
        message:
          'Cannot use the following characters: <, >, [, ], {, }, &, \', "',
      });
      return;
    }

    const sanitizedEmail = validator.isEmail(email);

    console.log(sanitizedEmail);

    if (sanitizedEmail) {
      const strapiRes = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await strapiRes.json();

      if (strapiRes.ok) {
        res.status(200).json({ data, strapiRes });
      } else {
        console.log(data);
        res
          .status(data.error.status)
          .json({ message: 'Something went wrong.' });
      }
    } else {
      res.status(400).json({ message: 'Please enter a valid email.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
