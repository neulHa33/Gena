import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '../../../lib/db';
import { Dashboard } from '../../../types/dashboard';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.data.dashboards);
}

export async function POST(req: NextRequest) {
  try {
    const db = await readDb();
    const { name, layout, charts, description } = await req.json();
    
    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Dashboard name is required' },
        { status: 400 }
      );
    }
    
    const newDashboard: Dashboard = {
      id: uuidv4(),
      name: name.trim(),
      charts: charts || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(description ? { description: description.trim() } : {}),
    };
    
    db.data.dashboards.push(newDashboard);
    await writeDb();
    
    return NextResponse.json(newDashboard, { status: 201 });
  } catch (error) {
    console.error('Error creating dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 