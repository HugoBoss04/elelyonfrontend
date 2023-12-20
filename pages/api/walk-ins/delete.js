import { API_URL } from '@/config/index';
import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'DELETE') {
    const { id } = req.body;
    const { token } = cookie.parse(req.headers.cookie);

    function isNumber(input) {
      return typeof input === 'number' && !isNaN(input);
    }

    if (!isNumber(id)) {
      res.status(403).json({ message: 'Invalid request' });
    }

    if (!token) {
      res.status(403).json({ message: 'Unauthorized' });
    }

    const strapiRes = await fetch(`${API_URL}/api/walk-ins/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await strapiRes.json();

    if (strapiRes.ok) {
      res.status(200).json({ data });
    } else {
      res.status(403).json({ message: 'Something went wrong.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
