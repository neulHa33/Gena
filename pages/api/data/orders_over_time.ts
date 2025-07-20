import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 22 },
  ]);
}
