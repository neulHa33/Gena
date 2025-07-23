import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '../../../lib/db';
import { Chart } from '../../../types/dashboard';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.data.charts);
}

export async function POST(req: NextRequest) {
  const db = await readDb();
  const { dashboardId, type, title, dataEndpoint, color } = await req.json();
  const newChart: Chart = {
    id: uuidv4(),
    dashboardId,
    type,
    title,
    dataEndpoint,
    color: color || '#60a5fa',
  };
  db.data.charts.push(newChart);
  await writeDb();
  return NextResponse.json(newChart, { status: 201 });
}