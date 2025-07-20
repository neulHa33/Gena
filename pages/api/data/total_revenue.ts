// pages/api/data/total_revenue.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json([
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 200 },
    { label: 'Mar', value: 300 },
    { label: 'Apr', value: 250 },
    { label: 'May', value: 400 }
  ]);
}
