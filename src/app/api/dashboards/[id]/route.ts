import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '../../../../lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const dashboard = db.data.dashboards.find((d) => d.id === id);
  if (!dashboard) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(dashboard);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const idx = db.data.dashboards.findIndex((d) => d.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const update = await req.json();
  db.data.dashboards[idx] = { ...db.data.dashboards[idx], ...update };
  await writeDb();
  return NextResponse.json(db.data.dashboards[idx]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  db.data.dashboards = db.data.dashboards.filter((d) => d.id !== id);
  await writeDb();
  return NextResponse.json({ success: true });
} 