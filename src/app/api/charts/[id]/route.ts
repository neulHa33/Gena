import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '../../../../lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const chart = db.data.charts.find((c) => c.id === id);
  if (!chart) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(chart);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const idx = db.data.charts.findIndex((c) => c.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const update = await req.json();
  db.data.charts[idx] = { ...db.data.charts[idx], ...update };
  await writeDb();
  return NextResponse.json(db.data.charts[idx]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  db.data.charts = db.data.charts.filter((c) => c.id !== id);
  await writeDb();
  return NextResponse.json({ success: true });
} 