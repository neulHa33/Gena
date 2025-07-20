// pages/api/dashboards/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import getDB from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  const db = await getDB();

  if (method === 'GET') {
    const dashboard = db.data?.dashboards.find(d => d.id === id);
    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

     const charts = db.data?.charts.filter(c => c.dashboardId === id) || [];

    return res.status(200).json({
      ...dashboard,
      charts, 
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
