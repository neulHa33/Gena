import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '../../../lib/db';
import { Dashboard } from '../../../types/dashboard';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.data.dashboards);
}

export async function POST(req: NextRequest) {
  const db = await readDb();
  const { name } = await req.json();
  const newDashboard: Dashboard = {
    id: uuidv4(),
    name,
    chartIds: [],
  };
  db.data.dashboards.push(newDashboard);
  await writeDb();
  return NextResponse.json(newDashboard, { status: 201 });
} 