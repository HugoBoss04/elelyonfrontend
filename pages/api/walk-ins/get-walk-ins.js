import { API_URL } from '@/config/index';
import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { token } = cookie.parse(req.headers.cookie);

    if (!token) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const strapiRes = await fetch(`${API_URL}/api/walk-ins?populate=*`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await strapiRes.json();

    if (strapiRes.ok) {
      res.status(200).json(data);
    } else {
      res.status(403).json({ message: 'Something went wrong.' });
      return;
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
