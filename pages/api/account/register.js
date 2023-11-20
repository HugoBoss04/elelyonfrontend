import { API_URL } from '@/config/index';
import cookie from 'cookie';
import { containsSpecialCharacters } from '@/utils/specialCharacterCheck';

export default async (req, res) => {
  const formatNumber = (number) => {
    let value = number.replace(/\D/g, ''); // Remove all non-digits
    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length > 6) {
      value =
        value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
    }
    return value;
  };
  if (req.method === 'POST') {
    const {
      email,
      password,
      firstName,
      lastName,
      number,
      confirmPassword,
      reminderType,
    } = req.body;
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !number ||
      !confirmPassword ||
      !reminderType
    ) {
      res.status(400).json({
        message: 'Please fill out all fields',
      });
    }

    if (
      reminderType !== 'both' &&
      reminderType !== 'text' &&
      reminderType !== 'email'
    ) {
      res.status(400).json({
        message: 'Something went wrong. Please try again.',
      });
    }

    if (
      containsSpecialCharacters(email) ||
      containsSpecialCharacters(password) ||
      containsSpecialCharacters(confirmPassword) ||
      containsSpecialCharacters(firstName) ||
      containsSpecialCharacters(lastName) ||
      containsSpecialCharacters(number) ||
      containsSpecialCharacters(reminderType)
    ) {
      res.status(400).json({
        message:
          'Cannot use the following characters: <, >, [, ], {, }, &, \', "',
      });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({
        message: 'Passwords do not match.',
      });
      return;
    }

    const formattedNumber = formatNumber(number);

    const strapiRes = await fetch(`${API_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        email,
        password,
        firstName,
        lastName,
        number: formattedNumber,
        reminderType,
      }),
    });

    const data = await strapiRes.json();

    if (strapiRes.ok) {
      res.status(200).json({ message: 'Success!! Please check your email.' });
    } else {
      res.status(data.error.status).json({ message: data.error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
