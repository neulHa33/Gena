// pages/api/dashboards.ts
import { NextApiRequest, NextApiResponse } from 'next'
import getDB from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDB()

  if (req.method === 'GET') {
    return res.status(200).json(db.data!.dashboards)
  }

  if (req.method === 'POST') {
    const { name } = req.body
    const newDashboard = {
      id: uuidv4(),
      name,
      charts: []
    }
    db.data!.dashboards.push(newDashboard)
    await db.write()
    return res.status(201).json(newDashboard)
  }

  return res.status(405).end()
}
