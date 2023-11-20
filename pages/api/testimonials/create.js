import { API_URL } from '@/config/index';
import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, rating, review } = req.body;
    const { token } = cookie.parse(req.headers.cookie);

    if (!token) {
      res
        .status(403)
        .json({ message: 'Only registered users can leave reviews.' });
    }

    const strapiRes = await fetch(`${API_URL}/api/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          name,
          rating,
          testimonial: review,
        },
      }),
    });

    const data = await strapiRes.json();

    if (strapiRes.ok) {
      res.status(200).json({ data });
    } else {
      res.status(data.error.status).json({ message: data.error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};
