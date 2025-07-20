// pages/api/charts/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import getDB from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
    const { dashboardId } = req.query;
    const db = await getDB();

    const charts = db.data!.charts.filter(c => c.dashboardId === dashboardId);
    return res.status(200).json(charts);
    }

    if (req.method === 'POST') {
    const { dashboardId, type, title, dataEndpoint } = req.body;

    if (!dashboardId || !type || !title || !dataEndpoint) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const db = await getDB();

    const newChart = {
      id: uuidv4(),
      dashboardId,
      type,
      title,
      dataEndpoint,
    };

    db.data!.charts.push(newChart);   // charts 배열에 추가
    await db.write();                 // 저장

    res.status(200).json(newChart);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
