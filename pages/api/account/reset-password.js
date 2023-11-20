import { API_URL } from '@/config/index';
import validator from 'validator';
import { containsSpecialCharacters } from 'utils/specialCharacterCheck';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { password, confirmPassword, code } = req.body;

    if (
      containsSpecialCharacters(password) ||
      containsSpecialCharacters(confirmPassword) ||
      containsSpecialCharacters(code)
    ) {
      res.status(400).json({
        message:
          'Cannot use the following characters in your password: <, >, [, ], {, }, &, \', "',
      });
      return;
    }

    const sanitizedData = {
      password: validator.escape(password),
      confirmPassword: validator.escape(confirmPassword),
    };

    if (!sanitizedData.password || !sanitizedData.confirmPassword) {
      res.status(400).json({
        message: `Please fill out all fields`,
        status: 400,
      });
      return;
    } else if (sanitizedData.password !== sanitizedData.confirmPassword) {
      res.status(400).json({
        message: `Passwords do not match.`,
        status: 400,
      });
      return;
    } else if (
      sanitizedData.password.length < 6 ||
      sanitizedData.confirmPassword.length < 6
    ) {
      res.status(400).json({
        message: `Password must be at least 6 characters.`,
        status: 400,
      });
      return;
    }

    const strapiRes = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        password: sanitizedData.password,
        passwordConfirmation: sanitizedData.confirmPassword,
      }),
    });

    const data = await strapiRes.json();

    if (strapiRes.ok) {
      res.status(200).json({ status: 200, data });
    } else {
      res.status(400).json({ message: data.error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
