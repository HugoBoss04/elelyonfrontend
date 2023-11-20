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

    if (sanitizedEmail) {
      const strapiUser = await fetch(
        `${API_URL}/api/users?filters[email][$eq]=${email}`
      );
      const user = await strapiUser.json();

      if (!user || user.length === 0) {
        res.status(404).json({ message: 'No account with that email exists.' });
        return;
      }

      user;

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
        //Set Cookie
        res.status(200).json({ data, strapiRes });
      } else {
        res.status(data.error.status).json({ data });
      }
    } else {
      res.status(400).json({ message: 'Please enter a valid email.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
