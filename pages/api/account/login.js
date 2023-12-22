import { API_URL } from '@/config/index';
import { containsSpecialCharacters } from '@/utils/specialCharacterCheck';
import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        message: 'Please fill out all fields',
      });
      return;
    }

    if (
      containsSpecialCharacters(identifier) ||
      containsSpecialCharacters(password)
    ) {
      res.status(400).json({
        message:
          'Cannot use the following characters: <, >, [, ], {, }, &, \', "',
      });
      return;
    }

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0), // 1 Week
        sameSite: 'strict',
        path: '/',
      })
    );

    const strapiRes = await fetch(`${API_URL}/api/custom-auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const data = await strapiRes.json();

    if (data?.user?.confirmed === false) {
      res.status(400).json({
        message: 'Your account is not verified. Please check your email.',
      });
    }

    if (strapiRes.ok) {
      //Set Cookie
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', data.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24 * 7, // 1 Week
          sameSite: 'strict',
          path: '/',
        })
      );
      res.status(200).json({ user: data.user });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
